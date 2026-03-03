import { useState } from "react";

const GENRES = ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic", "R&B", "Country", "Latin", "Other"];

const UploadTrack = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Other");
  const [album, setAlbum] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("audio/")) {
      setFile(dropped);
      setMessage({ text: "", type: "" });
    } else {
      setMessage({ text: "Only audio files are allowed!", type: "error" });
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith("audio/")) {
        setMessage({ text: "Only audio files are allowed!", type: "error" });
        return;
      }
      if (selected.size > 50 * 1024 * 1024) {
        setMessage({ text: "File size must be under 50MB.", type: "error" });
        return;
      }
      setFile(selected);
      setMessage({ text: "", type: "" });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim()) return setMessage({ text: "Track title is required.", type: "error" });
    if (!file) return setMessage({ text: "Please select an audio file.", type: "error" });

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("genre", genre);
    formData.append("album", album.trim());
    formData.append("tags", tags.trim());
    formData.append("track", file);

    setLoading(true);
    setProgress(0);
    setMessage({ text: "", type: "" });

    try {
      // Use XMLHttpRequest for upload progress tracking
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          try {
            resolve({ status: xhr.status, data: JSON.parse(xhr.responseText) });
          } catch {
            reject(new Error("Invalid server response"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));

        xhr.open("POST", "http://localhost:5000/upload-track");
        xhr.withCredentials = true; // ✅ Send session cookie
        xhr.send(formData);
      });

      if (result.status === 200 || result.status === 201) {
        setMessage({ text: "Track uploaded successfully! 🎵", type: "success" });
        setTitle(""); setDescription(""); setGenre("Other");
        setAlbum(""); setTags(""); setFile(null);
        setProgress(0);
        if (onUploadSuccess) onUploadSuccess(result.data.track);
      } else if (result.status === 401) {
        setMessage({ text: "You must be logged in to upload tracks.", type: "error" });
      } else {
        setMessage({ text: result.data.message || "Upload failed.", type: "error" });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({ text: "Server error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle(""); setDescription(""); setGenre("Other");
    setAlbum(""); setTags(""); setFile(null);
    setProgress(0); setMessage({ text: "", type: "" });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerIcon}>🎵</span>
          <div>
            <h2 style={styles.heading}>Upload Track</h2>
            <p style={styles.subheading}>Share your music with the world</p>
          </div>
        </div>

        <form onSubmit={handleUpload} style={styles.form}>
          {/* Drop Zone */}
          <div
            style={{
              ...styles.dropZone,
              ...(dragOver ? styles.dropZoneActive : {}),
              ...(file ? styles.dropZoneFilled : {}),
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {file ? (
              <div style={styles.fileInfo}>
                <span style={styles.fileIcon}>🎧</span>
                <div>
                  <p style={styles.fileName}>{file.name}</p>
                  <p style={styles.fileSize}>{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  style={styles.removeFile}
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >✕</button>
              </div>
            ) : (
              <div style={styles.dropPrompt}>
                <span style={{ fontSize: "32px" }}>☁️</span>
                <p style={styles.dropText}>Drag & drop your audio file here</p>
                <p style={styles.dropSub}>or click to browse · MP3, WAV, OGG, M4A · Max 50MB</p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {loading && (
            <div style={styles.progressWrap}>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
              </div>
              <span style={styles.progressLabel}>{progress}%</span>
            </div>
          )}

          {/* Title */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Title <span style={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="e.g. Midnight Echoes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Tell listeners about this track..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Genre + Album row */}
          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Genre</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value)} style={styles.input}>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Album</label>
              <input
                type="text"
                placeholder="Album name (optional)"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                style={styles.input}
                maxLength={100}
              />
            </div>
          </div>

          {/* Tags */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Tags</label>
            <input
              type="text"
              placeholder="e.g. chill, indie, acoustic (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
              maxLength={200}
            />
          </div>

          {/* Feedback message */}
          {message.text && (
            <div style={{ ...styles.feedback, ...(message.type === "error" ? styles.feedbackError : styles.feedbackSuccess) }}>
              {message.type === "error" ? "⚠️" : "✅"} {message.text}
            </div>
          )}

          {/* Action buttons */}
          <div style={styles.actions}>
            <button type="button" style={styles.resetBtn} onClick={handleReset} disabled={loading}>
              Reset
            </button>
            <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? `Uploading… ${progress}%` : "Upload Track 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px", minHeight: "100vh", backgroundColor: "#f3f4f6" },
  card: { backgroundColor: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" },
  headerIcon: { fontSize: "36px" },
  heading: { margin: 0, fontSize: "22px", color: "#111827", fontWeight: 700 },
  subheading: { margin: "2px 0 0", fontSize: "13px", color: "#6b7280" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  dropZone: { border: "2px dashed #d1d5db", borderRadius: "12px", padding: "24px", cursor: "pointer", transition: "all 0.2s", backgroundColor: "#fafafa", textAlign: "center" },
  dropZoneActive: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  dropZoneFilled: { borderColor: "#10b981", backgroundColor: "#f0fdf4", borderStyle: "solid" },
  dropPrompt: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  dropText: { margin: 0, fontSize: "15px", fontWeight: 600, color: "#374151" },
  dropSub: { margin: 0, fontSize: "12px", color: "#9ca3af" },
  fileInfo: { display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" },
  fileIcon: { fontSize: "28px" },
  fileName: { margin: 0, fontSize: "14px", fontWeight: 600, color: "#111827", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  fileSize: { margin: "2px 0 0", fontSize: "12px", color: "#6b7280" },
  removeFile: { background: "none", border: "none", color: "#ef4444", fontSize: "16px", cursor: "pointer", padding: "4px" },
  progressWrap: { display: "flex", alignItems: "center", gap: "10px" },
  progressTrack: { flex: 1, height: "6px", backgroundColor: "#e5e7eb", borderRadius: "99px", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#3b82f6", borderRadius: "99px", transition: "width 0.2s" },
  progressLabel: { fontSize: "12px", color: "#6b7280", minWidth: "32px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#374151" },
  required: { color: "#ef4444" },
  input: { padding: "9px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#111827", outline: "none", transition: "border 0.2s" },
  textarea: { padding: "9px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#111827", outline: "none", resize: "vertical", fontFamily: "inherit" },
  row: { display: "flex", gap: "14px" },
  feedback: { padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500 },
  feedbackError: { backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
  feedbackSuccess: { backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" },
  actions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  resetBtn: { padding: "10px 20px", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontWeight: 500 },
  submitBtn: { padding: "10px 24px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontWeight: 600, transition: "opacity 0.2s" },
};

export default UploadTrack;