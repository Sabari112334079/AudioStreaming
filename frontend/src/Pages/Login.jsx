import { useState, useCallback } from "react";

if (!document.querySelector("#login-styles")) {
  const s = document.createElement("style");
  s.id = "login-styles";
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

    .login-root {
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
    .login-root::before {
      content: '';
      position: fixed; top: -200px; left: -200px;
      width: 700px; height: 700px;
      background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%);
      pointer-events: none; z-index: 0;
    }
    .login-root::after {
      content: '';
      position: fixed; bottom: -200px; right: -200px;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%);
      pointer-events: none; z-index: 0;
    }

    .login-card {
      position: relative; z-index: 1;
      width: 100%; max-width: 460px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
      animation: loginUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    }
    @keyframes loginUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .login-head {
      padding: 40px 36px 32px;
      background: linear-gradient(160deg, #140826 0%, #0f1620 100%);
      position: relative; overflow: hidden;
      border-bottom: 1px solid var(--border);
      text-align: center;
    }
    .login-head::before {
      content: '';
      position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
      width: 320px; height: 320px;
      background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 65%);
      pointer-events: none;
    }
    .login-head::after {
      content: '';
      position: absolute; bottom: -60px; right: -60px;
      width: 220px; height: 220px;
      background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%);
      pointer-events: none;
    }

    .login-logo-ring {
      position: relative; z-index: 1;
      width: 72px; height: 72px; margin: 0 auto 18px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 34px;
      box-shadow: 0 8px 28px rgba(124,58,237,0.45);
    }
    /* Pulse ring */
    .login-logo-ring::before {
      content: '';
      position: absolute; inset: -6px;
      border-radius: 24px;
      border: 1px solid rgba(124,58,237,0.3);
      animation: loginPulse 2s ease-in-out infinite;
    }
    @keyframes loginPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.04); }
    }

    .login-head-title {
      font-size: 28px; font-weight: 900; letter-spacing: -1px;
      color: var(--text); margin-bottom: 8px; position: relative; z-index: 1;
    }
    .login-head-title span {
      background: linear-gradient(135deg, #fff 40%, #a78bfa 70%, #06b6d4 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .login-head-sub {
      font-size: 13px; color: var(--muted); position: relative; z-index: 1; line-height: 1.5;
    }

    /* Eyebrow tag */
    .login-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--accent2); font-family: 'DM Mono', monospace;
      background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.2);
      padding: 4px 10px; border-radius: 20px; margin-bottom: 14px;
      position: relative; z-index: 1;
    }
    .login-eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); display: inline-block; }

    /* Form body */
    .login-body {
      padding: 32px 36px 28px;
      display: flex; flex-direction: column; gap: 18px;
    }

    /* Field */
    .login-field { display: flex; flex-direction: column; gap: 6px; }
    .login-label {
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
      text-transform: uppercase; color: var(--muted);
      font-family: 'DM Mono', monospace;
    }
    .login-input-wrap { position: relative; }
    .login-input {
      width: 100%; padding: 13px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 13px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px; outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .login-input::placeholder { color: var(--muted); }
    .login-input:focus {
      border-color: var(--border-focus);
      background: rgba(124,58,237,0.06);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }
    .login-input.valid  { border-color: rgba(34,197,94,0.5); }
    .login-input.error  { border-color: rgba(244,63,94,0.5); }
    .login-input.error:focus { box-shadow: 0 0 0 3px rgba(244,63,94,0.1); }

    .login-eye {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      font-size: 16px; padding: 2px; line-height: 1; color: var(--muted);
      transition: color 0.15s;
    }
    .login-eye:hover { color: var(--text); }

    .login-error-msg { font-size: 11px; color: var(--red); font-weight: 600; display: flex; align-items: center; gap: 3px; }

    /* Divider */
    .login-or {
      display: flex; align-items: center; gap: 12px;
      font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace;
      text-transform: uppercase; letter-spacing: 1px;
    }
    .login-or::before, .login-or::after {
      content: ''; flex: 1; height: 1px; background: var(--border);
    }

    /* Social buttons (decorative — add your OAuth handlers) */
    .login-socials { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .login-social-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 11px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--muted); font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 600; cursor: pointer;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .login-social-btn:hover {
      border-color: rgba(124,58,237,0.35);
      color: var(--text);
      background: rgba(124,58,237,0.06);
    }

    /* Submit */
    .login-submit {
      padding: 14px;
      background: linear-gradient(135deg, var(--accent), #5b21b6);
      border: none; border-radius: 13px;
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 6px 20px rgba(124,58,237,0.4);
      width: 100%; position: relative; overflow: hidden;
    }
    .login-submit::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      opacity: 0; transition: opacity 0.2s;
    }
    .login-submit:hover:not(:disabled)::before { opacity: 1; }
    .login-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(124,58,237,0.5); }
    .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Message */
    .login-msg {
      text-align: center; font-size: 13px; font-weight: 600;
      padding: 10px 14px; border-radius: 10px;
    }
    .login-msg.success { background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
    .login-msg.fail    { background: rgba(244,63,94,0.1);  color: var(--red);  border: 1px solid rgba(244,63,94,0.2); }

    /* Footer */
    .login-foot {
      padding: 18px 36px 24px;
      text-align: center;
    }
    .login-foot p { font-size: 13px; color: var(--muted); margin: 0; }
    .login-foot-link {
      color: var(--accent2); font-weight: 700; cursor: pointer;
      transition: opacity 0.15s;
    }
    .login-foot-link:hover { opacity: 0.7; }

    /* Note about features */
    .login-features {
      display: flex; justify-content: center; gap: 20px;
      padding: 0 36px 24px; flex-wrap: wrap;
    }
    .login-feat {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; color: var(--subtle); font-family: 'DM Mono', monospace;
    }

    @media (max-width: 480px) {
      .login-body { padding: 24px 20px 20px; }
      .login-head { padding: 32px 20px 26px; }
      .login-foot { padding: 14px 20px 20px; }
      .login-features { padding: 0 20px 20px; }
    }
  `;
  document.head.appendChild(s);
}

async function hashPwd(pwd) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pwd));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

const RULES = {
  email: {
    validate: (v) => {
      if (!v.trim()) return "Email is required";
      const rx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
      if (!rx.test(v)) return "Enter a valid email address";
      return null;
    },
  },
  password: {
    validate: (v) => {
      if (!v) return "Password is required";
      if (v.length < 8) return "Minimum 8 characters";
      return null;
    },
  },
};

const Login = ({ setIsLoggedIn, setCurrentUser, setMode, setPage }) => {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [errors,  setErrors]  = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [msg,     setMsg]     = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const validate = useCallback((name, val) => RULES[name]?.validate(val) ?? null, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const errs = {}, tch = {};
    ["email","password"].forEach(f => { tch[f] = true; errs[f] = validate(f, form[f]); });
    setTouched(tch); setErrors(errs);
    return Object.values(errs).every(e => !e);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setLoading(true); setMsg({ text: "", type: "" });
    try {
      const res  = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: await hashPwd(form.password) }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setMode(data.user.mode || "Listener");
        setPage("home");
      } else {
        setMsg({ text: data.message || "Login failed. Check your credentials.", type: "fail" });
      }
    } catch {
      setMsg({ text: "Server error — make sure the backend is running.", type: "fail" });
    } finally { setLoading(false); }
  };

  const cls = (name) => touched[name] ? (errors[name] ? "error" : "valid") : "";

  return (
    <div className="login-root">
      <div className="login-card">

        {/* Header */}
        <div className="login-head">
          <div className="login-eyebrow">Welcome back</div>
          <div className="login-logo-ring">🎵</div>
          <div className="login-head-title">
            Sign in to <span>BabyTunes</span>
          </div>
          <div className="login-head-sub">
            Your music, your community — pick up where you left off
          </div>
        </div>

        {/* Body */}
        <div className="login-body">

          {/* Email */}
          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <input
                className={`login-input ${cls("email")}`}
                name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} onBlur={handleBlur}
                autoComplete="email" maxLength={100}
              />
            </div>
            {touched.email && errors.email && <span className="login-error-msg">⚠ {errors.email}</span>}
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <input
                className={`login-input ${cls("password")}`}
                name="password" type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password} onChange={handleChange} onBlur={handleBlur}
                autoComplete="current-password" maxLength={128}
                style={{ paddingRight: 40 }}
              />
              <button type="button" className="login-eye" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {touched.password && errors.password && <span className="login-error-msg">⚠ {errors.password}</span>}
          </div>

          {/* Submit */}
          <button className="login-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          {msg.text && <div className={`login-msg ${msg.type}`}>{msg.text}</div>}
        </div>

        {/* Feature hints */}
        <div className="login-features">
          {["🎵 Stream music", "🎧 Playlists", "🎤 Artists", "💬 Messages"].map(f => (
            <div key={f} className="login-feat">{f}</div>
          ))}
        </div>

        {/* Footer */}
        <div className="login-foot">
          <p>Don't have an account? <span className="login-foot-link" onClick={() => setPage("register")}>Create one free</span></p>
        </div>

      </div>
    </div>
  );
};

export default Login;