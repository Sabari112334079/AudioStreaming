import { useState, useCallback } from "react";

if (!document.querySelector("#reg-styles")) {
  const s = document.createElement("style");
  s.id = "reg-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --bg: #0a0a0f;
      --surface: #111118;
      --card: #16161f;
      --border: rgba(255,255,255,0.07);
      --border-focus: rgba(124,58,237,0.5);
      --accent: #7c3aed;
      --accent2: #06b6d4;
      --text: #f1f5f9;
      --muted: #64748b;
      --subtle: #334155;
      --green: #22c55e;
      --red: #f43f5e;
    }

    .reg-root {
      min-height: 100vh;
      background: var(--bg);
      font-family: 'Outfit', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
      position: relative;
      overflow: hidden;
    }

    /* Background glows */
    .reg-root::before {
      content: '';
      position: fixed; top: -200px; left: -200px;
      width: 700px; height: 700px;
      background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%);
      pointer-events: none; z-index: 0;
    }
    .reg-root::after {
      content: '';
      position: fixed; bottom: -200px; right: -200px;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%);
      pointer-events: none; z-index: 0;
    }

    .reg-card {
      position: relative; z-index: 1;
      width: 100%; max-width: 520px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
      animation: regFadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    }
    @keyframes regFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Card header */
    .reg-head {
      padding: 36px 36px 28px;
      background: linear-gradient(160deg, #140826 0%, #0f1620 100%);
      position: relative; overflow: hidden;
      border-bottom: 1px solid var(--border);
    }
    .reg-head::before {
      content: '';
      position: absolute; top: -80px; right: -80px;
      width: 280px; height: 280px;
      background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 65%);
      pointer-events: none;
    }
    .reg-head::after {
      content: '';
      position: absolute; bottom: -40px; left: -40px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%);
      pointer-events: none;
    }
    .reg-brand {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 20px; position: relative; z-index: 1;
    }
    .reg-logo {
      width: 44px; height: 44px; border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 16px rgba(124,58,237,0.4);
    }
    .reg-brand-name {
      font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .reg-head-title {
      font-size: 26px; font-weight: 900; letter-spacing: -1px;
      color: var(--text); margin-bottom: 6px; position: relative; z-index: 1;
    }
    .reg-head-sub { font-size: 13px; color: var(--muted); position: relative; z-index: 1; }

    /* Mode toggle */
    .reg-mode-toggle {
      display: flex; gap: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px; padding: 4px;
      margin-top: 20px; position: relative; z-index: 1;
    }
    .reg-mode-btn {
      flex: 1; padding: 9px 16px;
      border: none; border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 7px;
    }
    .reg-mode-btn.inactive {
      background: transparent; color: var(--muted);
    }
    .reg-mode-btn.inactive:hover { color: var(--text); }
    .reg-mode-btn.active {
      background: linear-gradient(135deg, var(--accent), #5b21b6);
      color: #fff;
      box-shadow: 0 4px 14px rgba(124,58,237,0.4);
    }

    /* Form body */
    .reg-body {
      padding: 28px 36px 32px;
      display: flex; flex-direction: column; gap: 16px;
      max-height: 65vh; overflow-y: auto;
      scrollbar-width: thin; scrollbar-color: var(--subtle) transparent;
    }
    .reg-body::-webkit-scrollbar { width: 4px; }
    .reg-body::-webkit-scrollbar-thumb { background: var(--subtle); border-radius: 4px; }

    /* Field */
    .reg-field { display: flex; flex-direction: column; gap: 6px; }
    .reg-label {
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
      text-transform: uppercase; color: var(--muted);
      font-family: 'DM Mono', monospace;
    }
    .reg-input-wrap { position: relative; }
    .reg-input {
      width: 100%; padding: 12px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px; outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .reg-input::placeholder { color: var(--muted); }
    .reg-input:focus {
      border-color: var(--border-focus);
      background: rgba(124,58,237,0.06);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }
    .reg-input.valid { border-color: rgba(34,197,94,0.5); }
    .reg-input.valid:focus { box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
    .reg-input.error { border-color: rgba(244,63,94,0.5); }
    .reg-input.error:focus { box-shadow: 0 0 0 3px rgba(244,63,94,0.1); }

    .reg-textarea {
      width: 100%; padding: 12px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px; outline: none; resize: vertical;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      box-sizing: border-box; min-height: 80px;
    }
    .reg-textarea::placeholder { color: var(--muted); }
    .reg-textarea:focus {
      border-color: var(--border-focus);
      background: rgba(124,58,237,0.06);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }

    /* Select */
    .reg-select {
      width: 100%; padding: 12px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box; cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }
    .reg-select:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    .reg-select option { background: #16161f; color: var(--text); }

    /* Eye toggle */
    .reg-eye {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      font-size: 16px; padding: 2px; line-height: 1; color: var(--muted);
      transition: color 0.15s;
    }
    .reg-eye:hover { color: var(--text); }

    /* Strength meter */
    .reg-strength-track {
      height: 3px; background: rgba(255,255,255,0.08);
      border-radius: 99px; overflow: hidden; margin-top: 6px;
    }
    .reg-strength-fill {
      height: 100%; border-radius: 99px;
      transition: width 0.3s ease, background-color 0.3s ease;
    }
    .reg-strength-label {
      font-size: 10px; font-family: 'DM Mono', monospace;
      font-weight: 500; margin-top: 3px;
    }

    /* Field meta row */
    .reg-meta {
      display: flex; justify-content: space-between; align-items: center;
      min-height: 16px;
    }
    .reg-error { font-size: 11px; color: var(--red); font-weight: 600; display: flex; align-items: center; gap: 3px; }
    .reg-count { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--muted); }
    .reg-count.warn { color: #f97316; }
    .reg-count.over { color: var(--red); }

    /* Submit button */
    .reg-submit {
      padding: 14px;
      background: linear-gradient(135deg, var(--accent), #5b21b6);
      border: none; border-radius: 13px;
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 6px 20px rgba(124,58,237,0.4);
      width: 100%; margin-top: 4px;
      position: relative; overflow: hidden;
    }
    .reg-submit::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      opacity: 0; transition: opacity 0.2s;
    }
    .reg-submit:hover:not(:disabled)::before { opacity: 1; }
    .reg-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(124,58,237,0.5); }
    .reg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Message */
    .reg-msg {
      text-align: center; font-size: 13px; font-weight: 600;
      padding: 10px 14px; border-radius: 10px; margin-top: 4px;
    }
    .reg-msg.success { background: rgba(34,197,94,0.12); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
    .reg-msg.fail    { background: rgba(244,63,94,0.1);  color: var(--red);   border: 1px solid rgba(244,63,94,0.2); }

    /* Footer */
    .reg-foot {
      padding: 18px 36px;
      background: var(--surface);
      border-top: 1px solid var(--border);
      text-align: center;
    }
    .reg-foot p { font-size: 13px; color: var(--muted); margin: 0; }
    .reg-foot-link {
      color: var(--accent2); font-weight: 700; cursor: pointer;
      text-decoration: none; transition: opacity 0.15s;
    }
    .reg-foot-link:hover { opacity: 0.75; }

    /* Two-col row */
    .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 480px) { .reg-row { grid-template-columns: 1fr; } .reg-body { padding: 20px 20px 24px; } .reg-head { padding: 28px 20px 22px; } .reg-foot { padding: 16px 20px; } }
  `;
  document.head.appendChild(s);
}

/* ── Helpers ── */
const RULES = {
  name: {
    max: 30,
    validate: (v) => {
      if (!v.trim()) return "Name is required";
      if (v.trim().length < 2) return "At least 2 characters";
      if (/[^a-zA-Z\s''-]/.test(v)) return "No special characters allowed";
      return null;
    },
  },
  email: {
    max: 100,
    validate: (v) => {
      if (!v.trim()) return "Email is required";
      const rx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
      if (!rx.test(v)) return "Enter a valid email";
      return null;
    },
  },
  password: {
    max: 128,
    validate: (v) => {
      if (!v) return "Password is required";
      if (v.length < 8) return "Minimum 8 characters";
      if (!/[A-Z]/.test(v)) return "Needs an uppercase letter";
      if (!/[a-z]/.test(v)) return "Needs a lowercase letter";
      if (!/[0-9]/.test(v)) return "Needs a number";
      if (!/[^A-Za-z0-9]/.test(v)) return "Needs a special character";
      return null;
    },
  },
  genre: {
    max: 50,
    validate: (v, mode) => {
      if (mode !== "Artist") return null;
      if (!v.trim()) return "Genre is required for artists";
      return null;
    },
  },
  bio:      { max: 200, validate: (v) => v.length > 200 ? "Max 200 characters" : null },
  location: { max: 60,  validate: (v) => v.length > 60  ? "Max 60 characters"  : null },
};

function strength(pwd) {
  if (!pwd) return { pct: 0, label: "", color: "transparent" };
  let s = 0;
  if (pwd.length >= 8)  s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd))      s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const map = [
    { pct: "16%",  label: "Weak",        color: "#f43f5e" },
    { pct: "32%",  label: "Weak",        color: "#f43f5e" },
    { pct: "52%",  label: "Fair",        color: "#f97316" },
    { pct: "70%",  label: "Good",        color: "#eab308" },
    { pct: "85%",  label: "Strong",      color: "#22c55e" },
    { pct: "100%", label: "Very Strong", color: "#06b6d4" },
  ];
  return map[s] || map[0];
}

async function hashPwd(pwd) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pwd));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ── Field wrapper ── */
const Field = ({ label, error, touched, max, len, children }) => {
  const countClass = len > max ? "over" : len > max * 0.85 ? "warn" : "";
  return (
    <div className="reg-field">
      <label className="reg-label">{label}</label>
      {children}
      <div className="reg-meta">
        {touched && error
          ? <span className="reg-error">⚠ {error}</span>
          : <span />}
        {max != null && <span className={`reg-count ${countClass}`}>{len}/{max}</span>}
      </div>
    </div>
  );
};

/* ── Register ── */
const Register = ({ setPage }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", mode: "Listener", genre: "", bio: "", location: "" });
  const [touched, setTouched]   = useState({});
  const [errors,  setErrors]    = useState({});
  const [showPwd, setShowPwd]   = useState(false);
  const [msg,     setMsg]       = useState({ text: "", type: "" });
  const [loading, setLoading]   = useState(false);

  const validate = useCallback((name, val) => RULES[name]?.validate(val, form.mode) ?? null, [form.mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const max = RULES[name]?.max;
    const v = max ? value.slice(0, max) : value;
    setForm(p => ({ ...p, [name]: v }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validate(name, v) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const fields = ["name", "email", "password", "genre", "bio", "location"];
    const errs = {}, tch = {};
    fields.forEach(f => { tch[f] = true; errs[f] = validate(f, form[f]); });
    setTouched(tch); setErrors(errs);
    return Object.values(errs).every(e => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) { setMsg({ text: "Please fix the errors above.", type: "fail" }); return; }
    setLoading(true); setMsg({ text: "", type: "" });
    try {
      const res  = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, password: await hashPwd(form.password) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: "Account created! Redirecting to login…", type: "success" });
        setTimeout(() => setPage("login"), 2000);
      } else {
        setMsg({ text: data.message || "Registration failed.", type: "fail" });
      }
    } catch {
      setMsg({ text: "Server error — make sure the backend is running.", type: "fail" });
    } finally { setLoading(false); }
  };

  const sw = strength(form.password);
  const cls = (name) => touched[name] ? (errors[name] ? "error" : "valid") : "";

  return (
    <div className="reg-root">
      <div className="reg-card">

        {/* Header */}
        <div className="reg-head">
          <div className="reg-brand">
            <div className="reg-logo">🎵</div>
            <span className="reg-brand-name">BabyTunes</span>
          </div>
          <div className="reg-head-title">Create Account</div>
          <div className="reg-head-sub">Join the community and start sharing music</div>

          {/* Mode toggle */}
          <div className="reg-mode-toggle">
            {["Listener", "Artist"].map(m => (
              <button
                key={m}
                className={`reg-mode-btn ${form.mode === m ? "active" : "inactive"}`}
                onClick={() => setForm(p => ({ ...p, mode: m }))}
              >
                {m === "Listener" ? "🎧" : "🎤"} {m}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="reg-body">

          {/* Name + Location row */}
          <div className="reg-row">
            <Field label="Full Name" error={errors.name} touched={touched.name} max={RULES.name.max} len={form.name.length}>
              <input className={`reg-input ${cls("name")}`} name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" />
            </Field>
            <Field label="Location" error={errors.location} touched={touched.location} max={RULES.location.max} len={form.location.length}>
              <input className={`reg-input ${cls("location")}`} name="location" type="text" placeholder="City, Country" value={form.location} onChange={handleChange} onBlur={handleBlur} />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email Address" error={errors.email} touched={touched.email} max={RULES.email.max} len={form.email.length}>
            <input className={`reg-input ${cls("email")}`} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password} touched={touched.password} max={RULES.password.max} len={form.password.length}>
            <div className="reg-input-wrap">
              <input
                className={`reg-input ${cls("password")}`}
                name="password" type={showPwd ? "text" : "password"}
                placeholder="Min 8 chars · upper · lower · number · symbol"
                value={form.password} onChange={handleChange} onBlur={handleBlur}
                autoComplete="new-password" style={{ paddingRight: 40 }}
              />
              <button type="button" className="reg-eye" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {form.password && (
              <>
                <div className="reg-strength-track">
                  <div className="reg-strength-fill" style={{ width: sw.pct, backgroundColor: sw.color }} />
                </div>
                <div className="reg-strength-label" style={{ color: sw.color }}>{sw.label}</div>
              </>
            )}
          </Field>

          {/* Genre — artist only */}
          {form.mode === "Artist" && (
            <Field label="Genre" error={errors.genre} touched={touched.genre} max={RULES.genre.max} len={form.genre.length}>
              <input className={`reg-input ${cls("genre")}`} name="genre" type="text" placeholder="e.g. Pop, Jazz, Hip-Hop" value={form.genre} onChange={handleChange} onBlur={handleBlur} />
            </Field>
          )}

          {/* Bio */}
          <Field label="Bio (optional)" error={errors.bio} touched={touched.bio} max={RULES.bio.max} len={form.bio.length}>
            <textarea className="reg-textarea" name="bio" placeholder="Tell the community about yourself…" value={form.bio} onChange={handleChange} onBlur={handleBlur} rows={3} />
          </Field>

          {/* Submit */}
          <button className="reg-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Account…" : "Create Account →"}
          </button>

          {msg.text && <div className={`reg-msg ${msg.type}`}>{msg.text}</div>}
        </div>

        {/* Footer */}
        <div className="reg-foot">
          <p>Already have an account? <span className="reg-foot-link" onClick={() => setPage("login")}>Sign in here</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;