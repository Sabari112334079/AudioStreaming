import { useEffect, useState } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
if (!document.querySelector("#profile-styles")) {
  const s = document.createElement("style");
  s.id = "profile-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --bg: #0a0a0f;
      --surface: #111118;
      --card: #16161f;
      --card-hover: #1c1c28;
      --border: rgba(255,255,255,0.07);
      --accent: #7c3aed;
      --accent2: #06b6d4;
      --green: #22c55e;
      --red: #f43f5e;
      --text: #f1f5f9;
      --muted: #64748b;
      --subtle: #334155;
    }

    .pf-root {
      min-height: calc(100vh - 64px);
      background: var(--bg);
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      padding: 48px 24px 80px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      position: relative;
      overflow: hidden;
    }
    .pf-root::before {
      content: '';
      position: absolute;
      top: -160px; left: 50%;
      transform: translateX(-50%);
      width: 700px; height: 400px;
      background: radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 70%);
      pointer-events: none;
    }

    .pf-wrap {
      width: 100%;
      max-width: 720px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    /* ── Card shell ── */
    .pf-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      animation: pfFadeUp 0.5s ease both;
    }

    /* ── Hero header ── */
    .pf-hero {
      padding: 40px 36px;
      background: linear-gradient(135deg, #1a0a2e 0%, #0f1a2e 100%);
      display: flex;
      align-items: center;
      gap: 28px;
      position: relative;
      overflow: hidden;
    }
    .pf-hero::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 280px; height: 280px;
      background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%);
      pointer-events: none;
    }
    .pf-hero::after {
      content: '';
      position: absolute;
      bottom: -40px; left: -40px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .pf-avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .pf-avatar {
      width: 96px; height: 96px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 36px;
      font-weight: 800;
      color: #fff;
      overflow: hidden;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.4), 0 0 32px rgba(124,58,237,0.25);
    }
    .pf-avatar img {
      width: 100%; height: 100%;
      object-fit: cover;
    }
    .pf-mode-ring {
      position: absolute;
      bottom: 2px; right: 2px;
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--card);
      border: 2px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
    }
    .pf-hero-info { flex: 1; min-width: 0; }
    .pf-hero-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .pf-hero-email {
      font-size: 13px;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      margin-bottom: 12px;
    }
    .pf-mode-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      background: rgba(124,58,237,0.18);
      border: 1px solid rgba(124,58,237,0.35);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #a78bfa;
      letter-spacing: 0.3px;
    }

    /* ── Stats row ── */
    .pf-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border-bottom: 1px solid var(--border);
    }
    .pf-stat-item {
      padding: 20px 16px;
      text-align: center;
      border-right: 1px solid var(--border);
      position: relative;
      transition: background 0.2s;
    }
    .pf-stat-item:last-child { border-right: none; }
    .pf-stat-item:hover { background: var(--card-hover); }
    .pf-stat-num {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -1px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;
    }
    .pf-stat-lbl {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-family: 'DM Mono', monospace;
    }

    /* ── Section ── */
    .pf-section {
      padding: 28px 32px;
      border-bottom: 1px solid var(--border);
    }
    .pf-section:last-child { border-bottom: none; }
    .pf-section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
    }
    .pf-section-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      display: flex; align-items: center; gap: 8px;
    }
    .pf-section-title span {
      font-size: 16px;
    }

    /* ── Info rows (view mode) ── */
    .pf-info-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .pf-info-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: background 0.2s;
    }
    .pf-info-row:hover { background: rgba(124,58,237,0.05); border-color: rgba(124,58,237,0.15); }
    .pf-info-key {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      min-width: 90px;
      padding-top: 1px;
    }
    .pf-info-val {
      font-size: 13px;
      color: var(--text);
      flex: 1;
      line-height: 1.6;
    }
    .pf-empty-val { color: var(--subtle); font-style: italic; }

    /* ── Edit form ── */
    .pf-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .pf-field {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .pf-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-family: 'DM Mono', monospace;
    }
    .pf-input, .pf-textarea {
      padding: 11px 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .pf-input:focus, .pf-textarea:focus {
      border-color: var(--accent);
      background: rgba(124,58,237,0.06);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }
    .pf-textarea { resize: vertical; min-height: 80px; }

    /* ── Buttons ── */
    .pf-btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
    }
    .pf-btn-ghost {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
    }
    .pf-btn-ghost:hover { border-color: var(--accent); color: #a78bfa; background: rgba(124,58,237,0.06); }
    .pf-btn-primary {
      background: linear-gradient(135deg, var(--accent), #6d28d9);
      color: #fff;
      box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    }
    .pf-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(124,58,237,0.4); }
    .pf-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .pf-btn-danger {
      background: rgba(244,63,94,0.1);
      border: 1px solid rgba(244,63,94,0.3);
      color: #f43f5e;
    }
    .pf-btn-danger:hover { background: rgba(244,63,94,0.18); border-color: #f43f5e; }

    /* ── Mode toggle card ── */
    .pf-mode-card {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 18px 20px;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 14px;
      transition: all 0.2s;
    }
    .pf-mode-card:hover { border-color: rgba(124,58,237,0.25); background: rgba(124,58,237,0.04); }
    .pf-mode-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15));
      border: 1px solid rgba(124,58,237,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .pf-mode-text { flex: 1; min-width: 0; }
    .pf-mode-name { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
    .pf-mode-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

    /* ── Toast ── */
    .pf-toast {
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      animation: pfFadeUp 0.3s ease;
    }
    .pf-toast.success { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
    .pf-toast.error   { background: rgba(244,63,94,0.12);  border: 1px solid rgba(244,63,94,0.3);  color: #fb7185; }

    /* ── Locked state ── */
    .pf-locked {
      min-height: calc(100vh - 64px);
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 14px; text-align: center;
      background: var(--bg);
      font-family: 'Outfit', sans-serif; color: var(--text);
    }
    .pf-locked-icon { font-size: 72px; opacity: 0.25; }
    .pf-locked h2 { font-size: 22px; font-weight: 700; }
    .pf-locked p  { font-size: 14px; color: var(--muted); }

    @keyframes pfFadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

// ─── Profile ──────────────────────────────────────────────────────────────────
const Profile = ({ setMode, currentUser }) => {
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "", bio: "", location: "", genre: "", mode: "Listener"
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        genre: currentUser.genre || "",
        mode: currentUser.mode || "Listener"
      });
    }
  }, [currentUser]);

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: user.email, ...formData })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMode(data.user.mode);
        setEditing(false);
        flash("✓ Profile saved");
        setTimeout(() => window.location.reload(), 900);
      } else {
        flash("✗ " + data.message);
      }
    } catch {
      flash("✗ Server error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async () => {
    const newMode = formData.mode === "Listener" ? "Artist" : "Listener";
    setFormData({ ...formData, mode: newMode });
    try {
      const res = await fetch("http://localhost:5000/update-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: user.email, mode: newMode })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMode(newMode);
        flash(`✓ Switched to ${newMode} mode`);
      }
    } catch {
      flash("✗ Failed to update mode");
    }
  };

  if (!user) {
    return (
      <div className="pf-locked">
        <div className="pf-locked-icon">🔒</div>
        <h2>Please log in</h2>
        <p>You need to be logged in to view your profile</p>
      </div>
    );
  }

  const isArtist = (user.mode || formData.mode) === "Artist";

  return (
    <div className="pf-root">
      <div className="pf-wrap">

        {/* ── Hero ── */}
        <div className="pf-card" style={{ animationDelay: "0s" }}>
          <div className="pf-hero">
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" />
                  : (user.name?.charAt(0)?.toUpperCase() || "?")}
              </div>
              <div className="pf-mode-ring">{isArtist ? "🎤" : "🎧"}</div>
            </div>
            <div className="pf-hero-info">
              <div className="pf-hero-name">{user.name}</div>
              <div className="pf-hero-email">{user.email}</div>
              <div className="pf-mode-badge">
                {isArtist ? "🎤 Artist" : "🎧 Listener"}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="pf-stats">
            {[
              { n: user.totalTracks || 0, l: "Tracks" },
              { n: user.followers || 0,   l: "Followers" },
              { n: user.following || 0,   l: "Following" },
            ].map(({ n, l }) => (
              <div className="pf-stat-item" key={l}>
                <div className="pf-stat-num">{n.toLocaleString()}</div>
                <div className="pf-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Profile Info ── */}
        <div className="pf-card" style={{ animationDelay: "0.08s" }}>
          <div className="pf-section">
            <div className="pf-section-head">
              <div className="pf-section-title"><span>👤</span> Profile Info</div>
              <button
                className="pf-btn pf-btn-ghost"
                onClick={() => setEditing(!editing)}
              >
                {editing ? "✕ Cancel" : "✏️ Edit"}
              </button>
            </div>

            {editing ? (
              <div className="pf-form">
                {[
                  { name: "name", label: "Display Name", type: "input" },
                  { name: "bio",  label: "Bio",          type: "textarea" },
                  { name: "location", label: "Location", type: "input", placeholder: "City, Country" },
                  ...(isArtist ? [{ name: "genre", label: "Genre", type: "input", placeholder: "e.g. Lo-fi, Jazz, Indie" }] : [])
                ].map(({ name, label, type, placeholder }) => (
                  <div className="pf-field" key={name}>
                    <label className="pf-label">{label}</label>
                    {type === "textarea"
                      ? <textarea className="pf-textarea" name={name} value={formData[name]} onChange={handleChange} placeholder="Tell us about yourself…" />
                      : <input className="pf-input" type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} />
                    }
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                  <button className="pf-btn pf-btn-primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? "Saving…" : "💾 Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pf-info-grid">
                {[
                  { key: "BIO",     val: user.bio      || null },
                  { key: "LOCATION",val: user.location || null },
                  ...(isArtist ? [{ key: "GENRE", val: user.genre || null }] : []),
                  { key: "JOINED",  val: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
                ].map(({ key, val }) => (
                  <div className="pf-info-row" key={key}>
                    <span className="pf-info-key">{key}</span>
                    <span className={`pf-info-val ${!val ? "pf-empty-val" : ""}`}>
                      {val || "Not set"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Account Type ── */}
        <div className="pf-card" style={{ animationDelay: "0.14s" }}>
          <div className="pf-section">
            <div className="pf-section-head">
              <div className="pf-section-title"><span>⚡</span> Account Type</div>
            </div>
            <div className="pf-mode-card">
              <div className="pf-mode-icon">{isArtist ? "🎤" : "🎧"}</div>
              <div className="pf-mode-text">
                <div className="pf-mode-name">{isArtist ? "Artist Mode" : "Listener Mode"}</div>
                <div className="pf-mode-desc">
                  {isArtist
                    ? "You can upload & share tracks with the community"
                    : "Switch to Artist to upload and share your music"}
                </div>
              </div>
              <button className="pf-btn pf-btn-danger" onClick={toggleMode}>
                Switch to {isArtist ? "Listener" : "Artist"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Toast ── */}
        {message && (
          <div className={`pf-toast ${message.startsWith("✓") ? "success" : "error"}`}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;