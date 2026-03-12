import { useEffect, useRef, useState } from "react";

const BASE = "http://localhost:5000";

// ─── Styles ───────────────────────────────────────────────────────────────────
if (!document.querySelector("#msg-styles")) {
  const s = document.createElement("style");
  s.id = "msg-styles";
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

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .ms-root {
      display: flex;
      height: calc(100vh - 64px);
      background: var(--bg);
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .ms-sidebar {
      width: 280px;
      min-width: 240px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }

    .ms-sidebar-head {
      padding: 20px 18px 14px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%);
    }
    .ms-sidebar-title {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.3px;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      flex: 1;
    }
    .ms-refresh {
      width: 30px; height: 30px;
      background: rgba(124,58,237,0.1);
      border: 1px solid rgba(124,58,237,0.2);
      border-radius: 8px;
      color: #a78bfa;
      font-size: 15px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .ms-refresh:hover { background: rgba(124,58,237,0.22); }

    .ms-search-wrap {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }
    .ms-search {
      width: 100%;
      padding: 9px 14px 9px 36px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    .ms-search:focus { border-color: var(--accent); background: rgba(124,58,237,0.06); }
    .ms-search::placeholder { color: var(--muted); }
    .ms-search-wrap { position: relative; padding: 12px 14px; border-bottom: 1px solid var(--border); }
    .ms-search-icon { position: absolute; left: 26px; top: 50%; transform: translateY(-50%); font-size: 13px; pointer-events: none; }

    .ms-user-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 0;
      scrollbar-width: thin;
      scrollbar-color: var(--subtle) transparent;
    }

    .ms-loading {
      display: flex; justify-content: center; gap: 6px; padding: 28px 0;
    }
    .ms-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--accent);
      animation: msDot 1.2s ease infinite;
    }
    .ms-dot:nth-child(2) { animation-delay: 0.2s; }
    .ms-dot:nth-child(3) { animation-delay: 0.4s; }

    .ms-empty-side {
      display: flex; flex-direction: column; align-items: center;
      padding: 36px 16px; gap: 8px; color: var(--muted); text-align: center;
    }
    .ms-empty-side p { margin: 0; font-size: 12px; line-height: 1.5; }

    .ms-user-item {
      display: flex; align-items: center; gap: 11px;
      padding: 11px 16px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: all 0.15s;
      position: relative;
    }
    .ms-user-item:hover { background: var(--card); }
    .ms-user-item.active { background: rgba(124,58,237,0.1); border-left-color: var(--accent); }

    .ms-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px; color: #fff;
      flex-shrink: 0; overflow: hidden;
    }
    .ms-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .ms-avatar.lg { width: 44px; height: 44px; font-size: 18px; }

    .ms-user-info { flex: 1; min-width: 0; }
    .ms-user-name { font-size: 13px; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ms-user-email { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }

    .ms-active-pip {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--accent); flex-shrink: 0;
      box-shadow: 0 0 8px var(--accent);
    }

    .ms-sidebar-foot {
      padding: 10px 16px;
      border-top: 1px solid var(--border);
      font-size: 11px; color: var(--subtle);
      font-family: 'DM Mono', monospace; text-align: center;
    }

    /* ── Chat area ── */
    .ms-chat {
      flex: 1; display: flex; flex-direction: column; min-width: 0;
    }

    .ms-empty-chat {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 10px; text-align: center; padding: 0 40px;
    }
    .ms-empty-chat-icon { font-size: 56px; opacity: 0.2; }
    .ms-empty-chat h3 { font-size: 18px; font-weight: 700; color: var(--text); }
    .ms-empty-chat p { font-size: 13px; color: var(--muted); }

    .ms-chat-header {
      padding: 14px 22px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 14px;
      background: linear-gradient(180deg, rgba(124,58,237,0.04) 0%, transparent 100%);
    }
    .ms-chat-name { font-size: 15px; font-weight: 700; color: var(--text); }
    .ms-chat-email { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }

    .ms-listen-btn {
      margin-left: auto;
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px; border-radius: 10px;
      background: rgba(6,182,212,0.08);
      border: 1px solid rgba(6,182,212,0.25);
      color: var(--accent2);
      cursor: pointer;
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
      transition: all 0.2s; white-space: nowrap;
    }
    .ms-listen-btn:hover { background: rgba(6,182,212,0.18); border-color: var(--accent2); }

    /* ── Message list ── */
    .ms-msg-list {
      flex: 1; overflow-y: auto; padding: 20px 24px;
      display: flex; flex-direction: column; gap: 10px;
      scrollbar-width: thin; scrollbar-color: var(--subtle) transparent;
    }

    .ms-bubble-wrap { display: flex; animation: msFadeIn 0.2s ease; }
    .ms-bubble-wrap.mine { justify-content: flex-end; }
    .ms-bubble-wrap.theirs { justify-content: flex-start; }

    .ms-bubble {
      max-width: 60%; padding: 10px 15px;
      border-radius: 16px; font-size: 14px; line-height: 1.5;
    }
    .ms-bubble p { margin: 0 0 3px; }
    .ms-bubble-mine {
      background: linear-gradient(135deg, rgba(124,58,237,0.35), rgba(109,40,217,0.4));
      border: 1px solid rgba(124,58,237,0.3);
      border-bottom-right-radius: 4px; color: var(--text);
    }
    .ms-bubble-theirs {
      background: var(--card);
      border: 1px solid var(--border);
      border-bottom-left-radius: 4px; color: #cbd5e1;
    }
    .ms-bubble-time {
      font-size: 10px; color: var(--muted);
      font-family: 'DM Mono', monospace;
      display: block; margin-top: 2px;
    }

    /* ── Listen card ── */
    .ms-listen-card {
      max-width: 270px; padding: 16px;
      border-radius: 16px; display: flex; flex-direction: column; gap: 9px;
      border: 1px solid rgba(6,182,212,0.35);
      background: rgba(6,182,212,0.05);
    }
    .ms-lc-top { display: flex; align-items: center; gap: 8px; }
    .ms-lc-label {
      font-size: 10px; color: var(--accent2); font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px;
      font-family: 'DM Mono', monospace;
    }
    .ms-lc-track { font-size: 14px; font-weight: 700; color: var(--text); }
    .ms-lc-artist { font-size: 12px; color: var(--muted); font-style: italic; }
    .ms-lc-accept {
      padding: 7px 14px;
      background: linear-gradient(135deg, var(--accent2), #0891b2);
      color: #fff; border: none; border-radius: 8px;
      font-weight: 700; cursor: pointer;
      font-family: 'Outfit', sans-serif; font-size: 12px;
      align-self: flex-start; transition: opacity 0.2s;
    }
    .ms-lc-accept:hover { opacity: 0.85; }
    .ms-lc-sent { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }

    /* ── Input row ── */
    .ms-input-row {
      padding: 14px 20px;
      border-top: 1px solid var(--border);
      display: flex; gap: 10px;
      background: rgba(10,10,15,0.8);
    }
    .ms-input {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 18px;
      color: var(--text);
      font-family: 'Outfit', sans-serif; font-size: 14px;
      outline: none; transition: border 0.2s;
    }
    .ms-input:focus { border-color: var(--accent); background: rgba(124,58,237,0.06); }
    .ms-send-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, var(--accent), #6d28d9);
      color: #fff; border: none; border-radius: 12px;
      font-weight: 700; cursor: pointer;
      font-family: 'Outfit', sans-serif; font-size: 13px;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(124,58,237,0.3);
    }
    .ms-send-btn:hover { opacity: 0.88; transform: translateY(-1px); }

    /* ── Overlay / Modal ── */
    .ms-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000; backdrop-filter: blur(6px);
    }
    .ms-modal {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px 30px;
      width: 360px;
      display: flex; flex-direction: column; gap: 18px;
      animation: msFadeIn 0.3s ease;
    }
    .ms-modal.pulse { animation: msFadeIn 0.3s ease, msPulse 1.8s ease infinite; border-color: var(--accent2) !important; }
    .ms-modal-title {
      font-size: 17px; font-weight: 800;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      display: flex; align-items: center; gap: 10px;
    }
    .ms-modal-sub { font-size: 13px; color: var(--muted); line-height: 1.6; }
    .ms-track-select {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border); border-radius: 10px;
      padding: 10px 14px; color: var(--text);
      font-family: 'Outfit', sans-serif; font-size: 13px;
      outline: none; width: 100%; cursor: pointer;
      transition: border-color 0.2s;
    }
    .ms-track-select:focus { border-color: var(--accent); }
    .ms-modal-invite-track {
      display: flex; align-items: center; gap: 12px;
      background: rgba(6,182,212,0.06);
      border: 1px solid rgba(6,182,212,0.2);
      padding: 14px 16px; border-radius: 12px;
    }
    .ms-modal-invite-track span { font-size: 14px; font-weight: 600; }
    .ms-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

    .ms-btn {
      padding: 9px 18px; border-radius: 10px;
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; border: none;
    }
    .ms-btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
    .ms-btn-ghost:hover { border-color: var(--red); color: var(--red); }
    .ms-btn-primary { background: linear-gradient(135deg, var(--accent), #6d28d9); color: #fff; box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
    .ms-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
    .ms-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .ms-btn-teal { background: linear-gradient(135deg, var(--accent2), #0891b2); color: #fff; box-shadow: 0 4px 14px rgba(6,182,212,0.25); }
    .ms-btn-teal:hover { opacity: 0.88; transform: translateY(-1px); }

    /* ── Session bar ── */
    .ms-session-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      height: 72px;
      background: rgba(10,10,15,0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(6,182,212,0.3);
      padding: 0 24px;
      display: flex; align-items: center; gap: 20px;
      z-index: 1500;
      box-shadow: 0 -8px 32px rgba(6,182,212,0.07);
    }
    .ms-session-left { display: flex; align-items: center; gap: 12px; min-width: 180px; }
    .ms-session-track { font-size: 13px; font-weight: 700; color: var(--text); }
    .ms-session-with { font-size: 11px; color: var(--accent2); font-family: 'DM Mono', monospace; }
    .ms-session-center { flex: 1; display: flex; align-items: center; gap: 10px; max-width: 500px; }
    .ms-sc-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--accent2); border: none; color: #fff;
      font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s; flex-shrink: 0;
    }
    .ms-sc-btn:hover { opacity: 0.8; }
    .ms-sc-bar { flex: 1; accent-color: var(--accent2); }
    .ms-sc-time { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; min-width: 32px; }
    .ms-session-close {
      background: transparent; border: 1px solid var(--subtle); color: var(--muted);
      padding: 6px 14px; border-radius: 8px; cursor: pointer;
      font-family: 'Outfit', sans-serif; font-size: 12px;
      transition: all 0.2s; white-space: nowrap;
    }
    .ms-session-close:hover { border-color: var(--red); color: var(--red); }

    /* ── Waveform ── */
    .ms-wave { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
    .ms-wave-bar {
      width: 3px; background: var(--accent2); border-radius: 2px;
      transition: height 0.3s ease;
    }
    .ms-wave-bar.active { animation: msWave 0.7s ease-in-out infinite alternate; }
    .ms-wave-bar:nth-child(1) { animation-delay: 0s; }
    .ms-wave-bar:nth-child(2) { animation-delay: 0.1s; }
    .ms-wave-bar:nth-child(3) { animation-delay: 0.2s; }
    .ms-wave-bar:nth-child(4) { animation-delay: 0.3s; }
    .ms-wave-bar:nth-child(5) { animation-delay: 0.15s; }

    @keyframes msFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes msDot    { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
    @keyframes msWave   { from { transform: scaleY(0.4); } to { transform: scaleY(1.3); } }
    @keyframes msPulse  { 0%,100% { box-shadow: 0 0 0 0 rgba(6,182,212,0.35); } 50% { box-shadow: 0 0 0 10px rgba(6,182,212,0); } }
  `;
  document.head.appendChild(s);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const timeAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};
const fmtTime = (s) => {
  if (isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

// ─── Waveform ─────────────────────────────────────────────────────────────────
const Waveform = ({ active }) => (
  <div className="ms-wave">
    {[5, 9, 13, 7, 11].map((h, i) => (
      <div
        key={i}
        className={`ms-wave-bar${active ? " active" : ""}`}
        style={{ height: active ? `${h}px` : "4px" }}
      />
    ))}
  </div>
);

// ─── Listen Card bubble ───────────────────────────────────────────────────────
function ListenCard({ msg, isMine, onAccept }) {
  return (
    <div className="ms-listen-card">
      <div className="ms-lc-top">
        <Waveform active={false} />
        <span className="ms-lc-label">Listen Together</span>
      </div>
      <div className="ms-lc-track">{msg.track?.title || "Unknown Track"}</div>
      <div className="ms-lc-artist">{msg.track?.artist || "Unknown Artist"}</div>
      {!isMine && !msg.isAccepted && (
        <button className="ms-lc-accept" onClick={onAccept}>▶ Accept & Listen</button>
      )}
      {!isMine && msg.isAccepted && <span className="ms-lc-sent">✓ Accepted</span>}
      {isMine && <span className="ms-lc-sent">Invite sent ✓</span>}
      <span className="ms-bubble-time">{timeAgo(msg.createdAt)}</span>
    </div>
  );
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export default function Messages({ currentUserEmail }) {
  const [allUsers, setAllUsers]         = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [newMsg, setNewMsg]             = useState("");
  const [tracks, setTracks]             = useState([]);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [showListenModal, setShowListenModal]   = useState(false);
  const [listenInvite, setListenInvite]         = useState(null);
  const [activeSession, setActiveSession]       = useState(null);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [progress, setProgress]                 = useState(0);
  const [duration, setDuration]                 = useState(0);
  const [selectedTrackId, setSelectedTrackId]   = useState("");

  const audioRef   = useRef(null);
  const pollRef    = useRef(null);
  const msgEndRef  = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => { selectedRef.current = selectedUser; }, [selectedUser]);

  useEffect(() => {
    if (!currentUserEmail) { setLoadingUsers(false); return; }
    fetchUsers();
    fetchTracks();
    pollRef.current = setInterval(() => {
      if (selectedRef.current) fetchMessagesSilent(selectedRef.current);
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [currentUserEmail]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredUsers(allUsers.filter(u =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    ));
  }, [searchQuery, allUsers]);

  useEffect(() => { if (selectedUser) fetchMessages(); }, [selectedUser]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  /* ─── Fetchers ─── */
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res  = await fetch(`${BASE}/users?email=${encodeURIComponent(currentUserEmail)}`, { credentials: "include" });
      const data = await res.json();
      setAllUsers(data.users || []);
    } catch { setAllUsers([]); }
    finally { setLoadingUsers(false); }
  };
  const fetchTracks = async () => {
    try {
      const res  = await fetch(`${BASE}/songs`);
      const data = await res.json();
      setTracks(data.songs || []);
    } catch { setTracks([]); }
  };
  const fetchMessages = async () => {
    if (!selectedUser) return;
    setLoadingMsgs(true);
    try {
      const res  = await fetch(`${BASE}/messages?sender=${encodeURIComponent(currentUserEmail)}&receiver=${encodeURIComponent(selectedUser.email)}`, { credentials: "include" });
      const data = await res.json();
      const msgs = data.messages || [];
      setMessages(msgs); checkPending(msgs);
    } catch { setMessages([]); }
    finally { setLoadingMsgs(false); }
  };
  const fetchMessagesSilent = async (partner) => {
    if (!partner) return;
    try {
      const res  = await fetch(`${BASE}/messages?sender=${encodeURIComponent(currentUserEmail)}&receiver=${encodeURIComponent(partner.email)}`, { credentials: "include" });
      const data = await res.json();
      const msgs = data.messages || [];
      setMessages(msgs); checkPending(msgs);
    } catch {}
  };
  const checkPending = (msgs) => {
    const p = msgs.find(m => m.type === "tune_request" && m.receiver === currentUserEmail && !m.isAccepted);
    if (p) setListenInvite(prev => prev?._id === p._id ? prev : p);
    else setListenInvite(null);
  };

  /* ─── Actions ─── */
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    try {
      const res = await fetch(`${BASE}/messages/send`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ sender: currentUserEmail, receiver: selectedUser.email, text: newMsg }),
      });
      if (res.ok) { setNewMsg(""); fetchMessagesSilent(selectedUser); }
    } catch {}
  };
  const sendListenInvite = async () => {
    if (!selectedTrackId || !selectedUser) return;
    try {
      const res = await fetch(`${BASE}/messages/tune-request`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ sender: currentUserEmail, receiver: selectedUser.email, trackId: selectedTrackId, text: "🎵 Listen together?" }),
      });
      if (res.ok) { setShowListenModal(false); setSelectedTrackId(""); fetchMessagesSilent(selectedUser); }
    } catch {}
  };
  const acceptTuneRequest = async (messageId, msg) => {
    try {
      const res = await fetch(`${BASE}/messages/accept-tune`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ messageId }),
      });
      if (res.ok) { startSession(msg); setListenInvite(null); fetchMessagesSilent(selectedUser); }
    } catch {}
  };
  const startSession = (msg) => {
    const track = msg.track;
    setActiveSession({ track, with: msg.sender === currentUserEmail ? msg.receiver : msg.sender });
    if (audioRef.current && track?.filename) {
      audioRef.current.src = `${BASE}/uploads/${track.filename}`;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else           { audioRef.current.play();  setIsPlaying(true);  }
  };
  const handleSeek = (e) => {
    const v = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = v;
    setProgress(v);
  };
  const closeSession = () => {
    audioRef.current?.pause();
    setActiveSession(null); setIsPlaying(false); setProgress(0);
  };

  /* ─── Locked ─── */
  if (!currentUserEmail) {
    return (
      <div className="ms-root" style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 64, opacity: 0.2 }}>🔒</div>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>Please log in</p>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#64748b" }}>You need to be logged in to send messages</p>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="ms-root">

        {/* ══ SIDEBAR ══ */}
        <aside className="ms-sidebar">
          <div className="ms-sidebar-head">
            <span style={{ fontSize: 18 }}>💬</span>
            <span className="ms-sidebar-title">Messages</span>
            <button className="ms-refresh" onClick={fetchUsers} title="Refresh">↻</button>
          </div>

          <div className="ms-search-wrap">
            <span className="ms-search-icon">🔍</span>
            <input className="ms-search" placeholder="Search users…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <div className="ms-user-list">
            {loadingUsers && (
              <div className="ms-loading">
                <div className="ms-dot" /><div className="ms-dot" /><div className="ms-dot" />
              </div>
            )}
            {!loadingUsers && filteredUsers.length === 0 && (
              <div className="ms-empty-side">
                <span style={{ fontSize: 28 }}>👥</span>
                <p>{searchQuery ? "No users match" : "No other users found"}</p>
              </div>
            )}
            {!loadingUsers && filteredUsers.map(u => (
              <div
                key={u.email}
                className={`ms-user-item${selectedUser?.email === u.email ? " active" : ""}`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="ms-avatar">
                  {u.avatar
                    ? <img src={u.avatar} alt={u.name} />
                    : (u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "?")}
                </div>
                <div className="ms-user-info">
                  <div className="ms-user-name">{u.name || "Unknown"}</div>
                  <div className="ms-user-email">{u.email}</div>
                </div>
                {selectedUser?.email === u.email && <div className="ms-active-pip" />}
              </div>
            ))}
          </div>

          {!loadingUsers && (
            <div className="ms-sidebar-foot">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          )}
        </aside>

        {/* ══ CHAT ══ */}
        <main className="ms-chat" style={{ paddingBottom: activeSession ? "72px" : 0 }}>
          {!selectedUser ? (
            <div className="ms-empty-chat">
              <div className="ms-empty-chat-icon">🎵</div>
              <h3>Pick someone to chat with</h3>
              <p>{allUsers.length > 0 ? `${allUsers.length} user${allUsers.length > 1 ? "s" : ""} in the sidebar` : "No other users yet"}</p>
            </div>
          ) : (
            <>
              <div className="ms-chat-header">
                <div className="ms-avatar lg">
                  {selectedUser.avatar
                    ? <img src={selectedUser.avatar} alt={selectedUser.name} />
                    : (selectedUser.name?.[0]?.toUpperCase() || "?")}
                </div>
                <div>
                  <div className="ms-chat-name">{selectedUser.name}</div>
                  <div className="ms-chat-email">{selectedUser.email}</div>
                </div>
                <button className="ms-listen-btn" onClick={() => setShowListenModal(true)}>
                  <Waveform active={false} />
                  <span>Listen Together</span>
                </button>
              </div>

              <div className="ms-msg-list">
                {loadingMsgs && <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading…</p>}
                {!loadingMsgs && messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--muted)", padding: "48px 0" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                    <p style={{ fontSize: 14 }}>No messages yet — say hi!</p>
                  </div>
                )}
                {messages.map(m => {
                  const isMine = m.sender === currentUserEmail;
                  return (
                    <div key={m._id} className={`ms-bubble-wrap ${isMine ? "mine" : "theirs"}`}>
                      {m.type === "tune_request" ? (
                        <ListenCard msg={m} isMine={isMine} onAccept={() => acceptTuneRequest(m._id, m)} />
                      ) : (
                        <div className={`ms-bubble ${isMine ? "ms-bubble-mine" : "ms-bubble-theirs"}`}>
                          <p>{m.text}</p>
                          <span className="ms-bubble-time">{timeAgo(m.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={msgEndRef} />
              </div>

              <div className="ms-input-row">
                <input
                  className="ms-input"
                  placeholder={`Message ${selectedUser.name}…`}
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button className="ms-send-btn" onClick={sendMessage}>Send ↑</button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ══ LISTEN MODAL ══ */}
      {showListenModal && (
        <div className="ms-overlay">
          <div className="ms-modal">
            <div className="ms-modal-title"><Waveform active /> Listen Together</div>
            <p className="ms-modal-sub">Pick a track for <strong>{selectedUser?.name}</strong></p>
            <select className="ms-track-select" value={selectedTrackId} onChange={e => setSelectedTrackId(e.target.value)}>
              <option value="">— Choose a track —</option>
              {tracks.map(t => (
                <option key={t._id} value={t._id}>{t.title} · {t.artist || "Unknown Artist"}</option>
              ))}
            </select>
            <div className="ms-modal-actions">
              <button className="ms-btn ms-btn-ghost" onClick={() => setShowListenModal(false)}>Cancel</button>
              <button className="ms-btn ms-btn-primary" onClick={sendListenInvite} disabled={!selectedTrackId}>Send Invite 🎵</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ INCOMING INVITE ══ */}
      {listenInvite && (
        <div className="ms-overlay">
          <div className="ms-modal pulse">
            <div style={{ textAlign: "center", fontSize: 44 }}>🎧</div>
            <div className="ms-modal-title" style={{ justifyContent: "center" }}>Listen Together?</div>
            <p className="ms-modal-sub" style={{ textAlign: "center" }}>
              <strong>{listenInvite.sender}</strong> wants to listen to
            </p>
            <div className="ms-modal-invite-track">
              <Waveform active />
              <span>{listenInvite.track?.title || "a track"}</span>
            </div>
            <div className="ms-modal-actions">
              <button className="ms-btn ms-btn-ghost" onClick={() => setListenInvite(null)}>Decline</button>
              <button className="ms-btn ms-btn-teal" onClick={() => acceptTuneRequest(listenInvite._id, listenInvite)}>Accept & Listen 🎵</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SESSION BAR ══ */}
      {activeSession && (
        <div className="ms-session-bar">
          <div className="ms-session-left">
            <Waveform active={isPlaying} />
            <div>
              <div className="ms-session-track">{activeSession.track?.title}</div>
              <div className="ms-session-with">🎧 with {activeSession.with}</div>
            </div>
          </div>
          <div className="ms-session-center">
            <button className="ms-sc-btn" onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
            <span className="ms-sc-time">{fmtTime(progress)}</span>
            <input type="range" className="ms-sc-bar" min={0} max={duration || 0} value={progress} onChange={handleSeek} />
            <span className="ms-sc-time">{fmtTime(duration)}</span>
          </div>
          <button className="ms-session-close" onClick={closeSession}>✕ End Session</button>
        </div>
      )}
    </>
  );
}