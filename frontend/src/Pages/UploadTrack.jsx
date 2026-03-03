import { useState } from "react";

const UploadTrack = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      setMessage("Title and audio file are required");
      return;
    }

    // Client-side check for audio type
    if (!file.type.startsWith("audio/")) {
      setMessage("Only audio files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("track", file); // Must match backend multer field

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/upload-track", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Track uploaded successfully 🎵");
        setTitle("");
        setDescription("");
        setFile(null);
      } else {
        setMessage(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎵 Upload Track</h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <input
          type="text"
          placeholder="Track Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Uploading..." : "Upload Track"}
        </button>
      </form>
      {message && <p style={{ marginTop: "10px", color: "#10b981" }}>{message}</p>}
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px" },
  form: { display: "flex", flexDirection: "column", width: "300px", gap: "15px" },
  input: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc", resize: "vertical" },
  button: { padding: "10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default UploadTrack;