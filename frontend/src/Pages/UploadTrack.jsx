import { useState, useCallback } from "react";

const GENRES = ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic", "R&B", "Country", "Latin", "Other"];

// ─── Styles ───────────────────────────────────────────────────────────────────
if (!document.querySelector("#upl-styles")) {
  const s = document.createElement("style");
  s.id = "upl-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

    .upl-root {
      min-height: 100vh;
      background: #0a0a0f;
      font-family: 'Outfit', sans-serif;
      color: #f1f5f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 60px;
    }

    .upl-page-header {
      width: 100%;
      padding: 48px 32px 36px;
      background: linear-gradient(180deg, #1a0a2e 0%, transparent 100%);
      position: relative;
      overflow: hidden;
      text-align: center;
    }
    .upl-page-header::before {
      content: '';
      position: absolute;
      top: -120px; left: -120px;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .upl-page-header::after {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .upl-page-title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -1.5px;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      margin-bottom: 6px;
    }
    .upl-page-sub {
      font-size: 14px;
      color: #64748b;
      position: relative;
    }

    .upl-card {
      background: #16161f;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      padding: 36px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      gap: 22px;
      margin-top: -8px;
    }

    .upl-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 7px;
      display: block;
    }

    .upl-input, .upl-select, .upl-textarea {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 11px;
      padding: 11px 14px;
      color: #f1f5f9;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .upl-input::placeholder, .upl-textarea::placeholder { color: #334155; }
    .upl-input:focus, .upl-select:focus, .upl-textarea:focus {
      border-color: rgba(124,58,237,0.5);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
    }
    .upl-input.err { border-color: rgba(244,63,94,0.6); box-shadow: 0 0 0 3px rgba(244,63,94,0.1); }
    .upl-input.ok  { border-color: rgba(34,197,94,0.5);  box-shadow: 0 0 0 3px rgba(34,197,94,0.08); }
    .upl-textarea  { resize: vertical; font-family: 'Outfit', sans-serif; }
    .upl-textarea.err { border-color: rgba(244,63,94,0.6); }
    .upl-select option { background: #16161f; color: #f1f5f9; }

    .upl-count      { font-size: 11px; color: #334155; text-align: right; margin-top: 3px; font-family: 'DM Mono', monospace; }
    .upl-count.warn { color: #f97316; }
    .upl-count.over { color: #f43f5e; }
    .upl-err { font-size: 11.5px; color: #f43f5e; font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 4px; }

    .upl-drop {
      border-radius: 14px;
      padding: 28px 20px;
      cursor: pointer;
      text-align: center;
      transition: border-color 0.2s, background 0.2s;
    }
    .upl-drop:hover { background: rgba(124,58,237,0.08) !important; border-color: rgba(124,58,237,0.5) !important; }

    .upl-cover-zone {
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s, background 0.2s;
      flex-shrink: 0;
    }
    .upl-cover-zone:hover { border-color: rgba(124,58,237,0.5) !important; background: rgba(124,58,237,0.06) !important; }

    .upl-progress-track {
      flex: 1;
      height: 5px;
      background: rgba(255,255,255,0.08);
      border-radius: 99px;
      overflow: hidden;
    }
    .upl-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #7c3aed, #06b6d4);
      border-radius: 99px;
      transition: width 0.2s;
    }

    .upl-banner { padding: 12px 16px; border-radius: 11px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
    .upl-banner.error   { background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25); color: #f43f5e; }
    .upl-banner.success { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.25);  color: #22c55e; }

    .upl-reset-btn {
      padding: 11px 22px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 11px;
      color: #94a3b8;
      font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .upl-reset-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: #f1f5f9; }
    .upl-reset-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .upl-submit-btn {
      flex: 1;
      padding: 11px 22px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border: none;
      border-radius: 11px;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 18px rgba(124,58,237,0.4);
    }
    .upl-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.55); }
    .upl-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

    .upl-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 2px 0; }

    .upl-section-title {
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: #64748b;
      display: flex; align-items: center; gap: 8px;
    }
    .upl-section-title::after {
      content: ''; flex: 1; height: 1px;
      background: rgba(255,255,255,0.06);
    }
  `;
  document.head.appendChild(s);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtSize = (b) => {
  if (!b) return "";
  return b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

const nameToTitle = (filename) =>
  filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const RULES = {
  title:       { max: 100, validate: (v) => !v.trim() ? "Track title is required" : v.length > 100 ? "Max 100 characters" : null },
  description: { max: 500, validate: (v) => v.length > 500 ? "Max 500 characters" : null },
  album:       { max: 100, validate: (v) => v.length > 100 ? "Max 100 characters" : null },
  tags:        { max: 200, validate: (v) => v.length > 200 ? "Max 200 characters" : null },
};

const validateAll = (form, file) => {
  const errs = {};
  Object.keys(RULES).forEach((k) => { const e = RULES[k].validate(form[k]); if (e) errs[k] = e; });
  if (!file) errs.file = "Please select an audio file";
  return errs;
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, required, error, touched, max, current, children }) => {
  const pct = max ? current / max : 0;
  const countClass = pct > 1 ? "over" : pct > 0.85 ? "warn" : "";
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label className="upl-label">
        {label}{required && <span style={{ color: "#f43f5e" }}> *</span>}
      </label>
      {children}
      <div style={{ display: "flex", justifyContent: "space-between", minHeight: "18px" }}>
        {touched && error ? <span className="upl-err">⚠ {error}</span> : <span />}
        {max != null && <span className={`upl-count ${countClass}`}>{current}/{max}</span>}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const UploadTrack = ({ onUploadSuccess }) => {
  const [form, setForm]               = useState({ title: "", description: "", genre: "Other", album: "", tags: "" });
  const [touched, setTouched]         = useState({});
  const [errors, setErrors]           = useState({});
  const [file, setFile]               = useState(null);
  const [cover, setCover]             = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [message, setMessage]         = useState({ text: "", type: "" });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const max = RULES[name]?.max;
    const clamped = max ? value.slice(0, max) : value;
    setForm((p) => ({ ...p, [name]: clamped }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: RULES[name]?.validate(clamped) }));
  }, [touched]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: RULES[name]?.validate(value) }));
  };

  const applyAudioFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("audio/")) { setErrors((p) => ({ ...p, file: "Only audio files are allowed" })); return; }
    if (f.size > 50 * 1024 * 1024)   { setErrors((p) => ({ ...p, file: "File must be under 50 MB" })); return; }
    setFile(f);
    setErrors((p) => ({ ...p, file: null }));
    setForm((p) => ({ ...p, title: p.title.trim() || nameToTitle(f.name) }));
    setTouched((p) => ({ ...p, title: true }));
  };

  const handleFileDrop   = (e) => { e.preventDefault(); setDragOver(false); applyAudioFile(e.dataTransfer.files[0]); };
  const handleFileChange = (e) => applyAudioFile(e.target.files[0]);

  const applyCoverFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setMessage({ text: "Cover must be an image (JPG, PNG, WebP)", type: "error" }); return; }
    if (f.size > 5 * 1024 * 1024)    { setMessage({ text: "Cover image must be under 5 MB", type: "error" }); return; }
    setCover(f); setCoverPreview(URL.createObjectURL(f));
    setMessage({ text: "", type: "" });
  };
  const handleCoverChange = (e) => applyCoverFile(e.target.files[0]);

  const handleUpload = async () => {
    const allTouched = Object.fromEntries(Object.keys(RULES).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validateAll(form, file);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) { setMessage({ text: "Please fix the errors above before uploading.", type: "error" }); return; }

    const fd = new FormData();
    fd.append("title", form.title.trim()); fd.append("description", form.description.trim());
    fd.append("genre", form.genre); fd.append("album", form.album.trim());
    fd.append("tags", form.tags.trim()); fd.append("track", file);
    if (cover) fd.append("cover", cover);

    setLoading(true); setProgress(0); setMessage({ text: "", type: "" });

    try {
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
        xhr.onload = () => { try { resolve({ status: xhr.status, data: JSON.parse(xhr.responseText) }); } catch { reject(new Error("Invalid response")); } };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", "http://localhost:5000/upload-track");
        xhr.withCredentials = true;
        xhr.send(fd);
      });

      if (result.status === 200 || result.status === 201) {
        setMessage({ text: "Track uploaded successfully! 🎵", type: "success" });
        handleReset();
        if (onUploadSuccess) onUploadSuccess(result.data.track);
      } else if (result.status === 401) {
        setMessage({ text: "You must be logged in to upload tracks.", type: "error" });
      } else {
        setMessage({ text: result.data.message || "Upload failed.", type: "error" });
      }
    } catch { setMessage({ text: "Server error. Please try again.", type: "error" }); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setForm({ title: "", description: "", genre: "Other", album: "", tags: "" });
    setTouched({}); setErrors({}); setFile(null); setCover(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null); setProgress(0); setMessage({ text: "", type: "" });
  };

  const inputClass = (name) =>
    `upl-input${touched[name] ? (errors[name] ? " err" : " ok") : ""}`;

  const dropBorderColor = errors.file ? "rgba(244,63,94,0.6)" : file ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.1)";
  const dropBorderStyle = file ? "solid" : "dashed";
  const dropBg          = file ? "rgba(34,197,94,0.07)" : dragOver ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.02)";

  return (
    <div className="upl-root">
      {/* Page header */}
      <div className="upl-page-header">
        <div className="upl-page-title">⬆ Upload Track</div>
        <div className="upl-page-sub">Share your music with the world</div>
      </div>

      {/* Main card */}
      <div className="upl-card">

        {/* ── Audio drop zone ── */}
        <div>
          <span className="upl-section-title">Audio File</span>
          <div style={{ height: "12px" }} />
          <div
            className="upl-drop"
            style={{ borderWidth: "2px", borderStyle: dropBorderStyle, borderColor: dropBorderColor, background: dropBg }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => !file && document.getElementById("upl-audioInput").click()}
          >
            <input id="upl-audioInput" type="file" accept="audio/*" style={{ display: "none" }} onChange={handleFileChange} />
            {file ? (
              <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center" }}>
                <div style={{ width: "46px", height: "46px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🎧</div>
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b", fontFamily: "'DM Mono', monospace" }}>{fmtSize(file.size)}</p>
                </div>
                <button type="button"
                  style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "8px", color: "#f43f5e", fontSize: "13px", cursor: "pointer", padding: "5px 10px", flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}
                  onClick={(e) => { e.stopPropagation(); setFile(null); setForm((p) => ({ ...p, title: "" })); }}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "52px", height: "52px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "4px" }}>☁️</div>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#f1f5f9" }}>Drag & drop your audio file</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>or click to browse · MP3, WAV, OGG, M4A · Max 50 MB</p>
              </div>
            )}
          </div>
          {errors.file && <span className="upl-err" style={{ marginTop: "6px" }}>⚠ {errors.file}</span>}
        </div>

        {/* ── Cover image ── */}
        <div>
          <span className="upl-section-title">Cover Image</span>
          <div style={{ height: "12px" }} />
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div
              className="upl-cover-zone"
              style={{ width: "88px", height: "88px", borderWidth: "2px", borderStyle: "dashed", borderColor: coverPreview ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.1)", background: coverPreview ? "transparent" : "rgba(255,255,255,0.03)" }}
              onClick={() => document.getElementById("upl-coverInput").click()}
            >
              <input id="upl-coverInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverChange} />
              {coverPreview
                ? <img src={coverPreview} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "28px", opacity: 0.5 }}>🖼️</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              {cover ? (
                <>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cover.name}</p>
                  <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#64748b", fontFamily: "'DM Mono', monospace" }}>{fmtSize(cover.size)}</p>
                  <button type="button"
                    style={{ fontSize: "12px", color: "#f43f5e", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: "7px", cursor: "pointer", padding: "4px 10px", fontFamily: "'Outfit', sans-serif" }}
                    onClick={() => { setCover(null); if (coverPreview) URL.revokeObjectURL(coverPreview); setCoverPreview(null); }}>
                    Remove cover
                  </button>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
                  Click the box to upload a cover image<br />
                  <span style={{ fontSize: "12px", color: "#334155" }}>JPG, PNG or WebP · Max 5 MB · Optional</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Upload progress ── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="upl-progress-track">
              <div className="upl-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: "12px", color: "#64748b", minWidth: "36px", textAlign: "right", fontFamily: "'DM Mono', monospace" }}>{progress}%</span>
          </div>
        )}

        <div className="upl-divider" />

        {/* ── Track details ── */}
        <span className="upl-section-title">Track Details</span>

        <Field label="Track Title" required error={errors.title} touched={touched.title} max={RULES.title.max} current={form.title.length}>
          <input className={inputClass("title")} name="title" placeholder="e.g. Midnight Echoes" value={form.title} onChange={handleChange} onBlur={handleBlur} />
        </Field>

        <Field label="Description" error={errors.description} touched={touched.description} max={RULES.description.max} current={form.description.length}>
          <textarea className={`upl-textarea${touched.description && errors.description ? " err" : ""}`} name="description" placeholder="Tell listeners about this track…" value={form.description} onChange={handleChange} onBlur={handleBlur} rows={3} />
        </Field>

        <div style={{ display: "flex", gap: "14px" }}>
          <div style={{ flex: 1 }}>
            <label className="upl-label">Genre</label>
            <select className="upl-select" name="genre" value={form.genre} onChange={handleChange}>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Album" error={errors.album} touched={touched.album} max={RULES.album.max} current={form.album.length}>
              <input className={inputClass("album")} name="album" placeholder="Album name (optional)" value={form.album} onChange={handleChange} onBlur={handleBlur} />
            </Field>
          </div>
        </div>

        <Field label="Tags" error={errors.tags} touched={touched.tags} max={RULES.tags.max} current={form.tags.length}>
          <input className={inputClass("tags")} name="tags" placeholder="e.g. chill, indie, acoustic (comma separated)" value={form.tags} onChange={handleChange} onBlur={handleBlur} />
        </Field>

        {message.text && (
          <div className={`upl-banner ${message.type}`}>
            {message.type === "error" ? "⚠️" : "✅"} {message.text}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
          <button type="button" className="upl-reset-btn" onClick={handleReset} disabled={loading}>Reset</button>
          <button type="button" className="upl-submit-btn" onClick={handleUpload} disabled={loading}>
            {loading ? `Uploading… ${progress}%` : "Upload Track 🚀"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadTrack;