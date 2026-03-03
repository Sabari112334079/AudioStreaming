import { useEffect, useRef, useState } from "react";

const BASE = "http://localhost:5000";

const timeAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};

const formatTime = (s) => {
  if (isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const Waveform = ({ active }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "18px" }}>
    {[4, 8, 12, 6, 14, 10, 5, 13, 7, 11].map((h, i) => (
      <div
        key={i}
        style={{
          width: "3px",
          height: active ? `${h}px` : "4px",
          backgroundColor: active ? "#00f5c4" : "#334155",
          borderRadius: "2px",
          transition: `height ${0.3 + i * 0.05}s ease`,
          animation: active ? `wave ${0.6 + (i % 3) * 0.2}s ease-in-out infinite alternate` : "none",
        }}
      />
    ))}
  </div>
);

function ListenCard({ msg, isMine, onAccept }) {
  return (
    <div className={`listen-card ${isMine ? "listen-card-mine" : "listen-card-theirs"}`}>
      <div className="lc-top">
        <Waveform active={false} />
        <span className="lc-label">Listen Together Invite</span>
      </div>
      <p className="lc-track">{msg.track?.title || "Unknown Track"}</p>
      {!isMine && (
        <button className="lc-accept" onClick={onAccept}>▶ Accept & Listen</button>
      )}
      {isMine && <span className="lc-sent">Invite sent ✓</span>}
      <span className="bubble-time">{timeAgo(msg.createdAt)}</span>
    </div>
  );
}

export default function Messages({ currentUserEmail }) {
  const [allUsers, setAllUsers]           = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedUser, setSelectedUser]   = useState(null);
  const [messages, setMessages]           = useState([]);
  const [newMsg, setNewMsg]               = useState("");
  const [tracks, setTracks]               = useState([]);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [loadingUsers, setLoadingUsers]   = useState(true);

  const [showListenModal, setShowListenModal] = useState(false);
  const [listenInvite, setListenInvite]       = useState(null);
  const [activeSession, setActiveSession]     = useState(null);
  const [isPlaying, setIsPlaying]             = useState(false);
  const [progress, setProgress]               = useState(0);
  const [duration, setDuration]               = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState("");

  const audioRef    = useRef(null);
  const pollRef     = useRef(null);
  const msgEndRef   = useRef(null);
  const selectedRef = useRef(null); // ← fixes stale closure in interval

  // keep ref in sync with state
  useEffect(() => { selectedRef.current = selectedUser; }, [selectedUser]);

useEffect(() => {
  console.log('🔍 currentUserEmail changed:', currentUserEmail);
  if (!currentUserEmail) {
    console.log('⚠️ No currentUserEmail yet, skipping fetch');
    return;
  }
  
  console.log('✅ Fetching users and tracks...');
  fetchUsers();
  fetchTracks();
  
  pollRef.current = setInterval(() => {
    if (selectedRef.current) fetchMessagesSilent(selectedRef.current);
  }, 3000);
  
  return () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };
}, [currentUserEmail]);

  // filter sidebar whenever search or users change
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredUsers(
      allUsers.filter(
        (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, allUsers]);

  useEffect(() => { if (selectedUser) fetchMessages(); }, [selectedUser]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  /* ─── fetchers ─── */
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res  = await fetch(`${BASE}/users?email=${encodeURIComponent(currentUserEmail)}`);
      const data = await res.json();
      console.log("✅ Users:", data.users);
      setAllUsers(data.users || []);
    } catch (e) { console.error(e); }
    finally { setLoadingUsers(false); }
  };

  const fetchTracks = async () => {
    try {
      const res  = await fetch(`${BASE}/songs`);
      const data = await res.json();
      setTracks(data.songs || []);
    } catch (e) { console.error(e); }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    setLoadingMsgs(true);
    try {
      const res  = await fetch(
        `${BASE}/messages?sender=${encodeURIComponent(currentUserEmail)}&receiver=${encodeURIComponent(selectedUser.email)}`
      );
      const data = await res.json();
      const msgs = data.messages || [];
      setMessages(msgs);
      checkPending(msgs);
    } catch (e) { console.error(e); }
    finally { setLoadingMsgs(false); }
  };

  const fetchMessagesSilent = async (partner) => {
    if (!partner) return;
    try {
      const res  = await fetch(
        `${BASE}/messages?sender=${encodeURIComponent(currentUserEmail)}&receiver=${encodeURIComponent(partner.email)}`
      );
      const data = await res.json();
      const msgs = data.messages || [];
      setMessages(msgs);
      checkPending(msgs);
    } catch (e) { console.error(e); }
  };

  const checkPending = (msgs) => {
    const p = msgs.find(
      (m) => m.type === "tune_request" && m.receiver === currentUserEmail && !m.isAccepted
    );
    if (p) setListenInvite((prev) => (prev?._id === p._id ? prev : p));
    else   setListenInvite(null);
  };

  /* ─── actions ─── */
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    try {
      await fetch(`${BASE}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: currentUserEmail, receiver: selectedUser.email, text: newMsg }),
      });
      setNewMsg("");
      fetchMessagesSilent(selectedUser);
    } catch (e) { console.error(e); }
  };

  const sendListenInvite = async () => {
    if (!selectedTrackId || !selectedUser) return;
    try {
      await fetch(`${BASE}/messages/tune-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUserEmail, receiver: selectedUser.email,
          trackId: selectedTrackId, text: "🎵 Listen together?",
        }),
      });
      setShowListenModal(false);
      setSelectedTrackId("");
      fetchMessagesSilent(selectedUser);
    } catch (e) { console.error(e); }
  };

  const acceptTuneRequest = async (messageId, msg) => {
    try {
      await fetch(`${BASE}/messages/accept-tune`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      startSession(msg);
      setListenInvite(null);
      fetchMessagesSilent(selectedUser);
    } catch (e) { console.error(e); }
  };

  const startSession = (msg) => {
    const track   = msg.track;
    const partner = msg.sender === currentUserEmail ? msg.receiver : msg.sender;
    setActiveSession({ track, with: partner });
    if (audioRef.current && track?.filename) {
      audioRef.current.src = `${BASE}/uploads/${track.filename}`;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else           { audioRef.current.play();  setIsPlaying(true); }
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

  /* ─── render ─── */
  return (
    <>
      <style>{CSS}</style>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="msg-root">

        {/* ══ SIDEBAR ══ */}
        <aside className="msg-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-logo">💬</span>
            <span className="sidebar-title">Messages</span>
            <button className="refresh-btn" onClick={fetchUsers} title="Refresh">↻</button>
          </div>

          {/* inline search — always visible */}
          <div className="sidebar-search">
            <input
              className="search-input"
              placeholder="🔍  Search users…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="user-list">
            {/* loading state */}
            {loadingUsers && (
              <div className="loading-wrap">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            )}

            {/* empty state */}
            {!loadingUsers && filteredUsers.length === 0 && (
              <div className="empty-state">
                <span style={{ fontSize: 28 }}>👥</span>
                <p>{searchQuery ? "No users match" : "No other users found"}</p>
              </div>
            )}

            {/* ✅ ALL users listed directly — click to open chat */}
            {!loadingUsers && filteredUsers.map((u) => (
              <div
                key={u.email}
                className={`user-item ${selectedUser?.email === u.email ? "active" : ""}`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="avatar">
                  {u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="user-info">
                  <span className="user-name">{u.name || "Unknown"}</span>
                  <span className="user-email">{u.email}</span>
                </div>
                {selectedUser?.email === u.email && <div className="active-pip" />}
              </div>
            ))}
          </div>

          {!loadingUsers && (
            <div className="sidebar-footer">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          )}
        </aside>

        {/* ══ CHAT ══ */}
        <main className="msg-chat" style={{ paddingBottom: activeSession ? "72px" : 0 }}>
          {!selectedUser ? (
            <div className="no-chat">
              <div style={{ fontSize: 52 }}>🎵</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#475569", margin: 0 }}>
                Pick someone to chat with
              </p>
              <p style={{ fontSize: 13, color: "#334155", margin: 0 }}>
                {allUsers.length > 0
                  ? `${allUsers.length} user${allUsers.length > 1 ? "s" : ""} in the sidebar`
                  : "No other users yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="avatar lg">{selectedUser.name?.[0]?.toUpperCase() || "?"}</div>
                <div>
                  <div className="chat-name">{selectedUser.name}</div>
                  <div className="chat-email">{selectedUser.email}</div>
                </div>
                <button className="listen-btn" onClick={() => setShowListenModal(true)}>
                  <Waveform active={false} /><span>Listen Together</span>
                </button>
              </div>

              <div className="msg-list">
                {loadingMsgs && <p className="empty-hint">Loading…</p>}
                {!loadingMsgs && messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "#475569", padding: "40px 0" }}>
                    <div style={{ fontSize: 32 }}>👋</div>
                    <p style={{ margin: "8px 0 0" }}>No messages yet. Say hi!</p>
                  </div>
                )}
                {messages.map((m) => {
                  const isMine = m.sender === currentUserEmail;
                  return (
                    <div key={m._id} className={`bubble-wrap ${isMine ? "mine" : "theirs"}`}>
                      {m.type === "tune_request" ? (
                        <ListenCard msg={m} isMine={isMine} onAccept={() => acceptTuneRequest(m._id, m)} />
                      ) : (
                        <div className={`bubble ${isMine ? "bubble-mine" : "bubble-theirs"}`}>
                          <p>{m.text}</p>
                          <span className="bubble-time">{timeAgo(m.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={msgEndRef} />
              </div>

              <div className="msg-input-row">
                <input
                  className="msg-input"
                  placeholder={`Message ${selectedUser.name}…`}
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="send-btn" onClick={sendMessage}>Send ↑</button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ══ LISTEN TOGETHER MODAL ══ */}
      {showListenModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header"><Waveform active /><h3>Listen Together</h3></div>
            <p className="modal-sub">Pick a track for <strong>{selectedUser?.name}</strong></p>
            <select className="track-select" value={selectedTrackId} onChange={(e) => setSelectedTrackId(e.target.value)}>
              <option value="">— Choose a track —</option>
              {tracks.map((t) => <option key={t._id} value={t._id}>{t.title} · {t.originalName}</option>)}
            </select>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowListenModal(false)}>Cancel</button>
              <button className="btn-send" onClick={sendListenInvite} disabled={!selectedTrackId}>Send Invite 🎵</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ INCOMING INVITE ══ */}
      {listenInvite && (
        <div className="overlay">
          <div className="modal pulse-border">
            <div style={{ fontSize: 48, textAlign: "center" }}>🎧</div>
            <h3 style={{ margin: 0, textAlign: "center", color: "#00f5c4" }}>Listen Together?</h3>
            <p className="modal-sub" style={{ textAlign: "center" }}>
              <strong>{listenInvite.sender}</strong> wants to listen to
            </p>
            <div className="invite-track"><Waveform active /><span>{listenInvite.track?.title || "a track"}</span></div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setListenInvite(null)}>Decline</button>
              <button className="btn-send" onClick={() => acceptTuneRequest(listenInvite._id, listenInvite)}>Accept & Listen 🎵</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SESSION BAR ══ */}
      {activeSession && (
        <div className="session-bar">
          <div className="session-left">
            <Waveform active={isPlaying} />
            <div>
              <div className="session-track">{activeSession.track?.title}</div>
              <div className="session-with">🎧 with {activeSession.with}</div>
            </div>
          </div>
          <div className="session-center">
            <button className="sc-btn" onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
            <span className="sc-time">{formatTime(progress)}</span>
            <input type="range" className="sc-bar" min={0} max={duration || 0} value={progress} onChange={handleSeek} />
            <span className="sc-time">{formatTime(duration)}</span>
          </div>
          <button className="session-close" onClick={closeSession}>✕ End Session</button>
        </div>
      )}
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');

  @keyframes wave { from{transform:scaleY(0.4)} to{transform:scaleY(1.2)} }
  @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(0,245,196,0.4)} 50%{box-shadow:0 0 0 12px rgba(0,245,196,0)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.15} }

  *,*::before,*::after{box-sizing:border-box}

  .msg-root{display:flex;height:calc(100vh - 64px);background:#080c14;font-family:'Syne',sans-serif;color:#e2e8f0;overflow:hidden}

  /* sidebar */
  .msg-sidebar{width:272px;min-width:220px;background:#0d1320;border-right:1px solid #1e293b;display:flex;flex-direction:column}
  .sidebar-header{padding:16px 14px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:8px}
  .sidebar-logo{font-size:20px}
  .sidebar-title{font-size:15px;font-weight:700;color:#00f5c4;letter-spacing:.5px;flex:1}
  .refresh-btn{background:rgba(0,245,196,.1);border:1px solid rgba(0,245,196,.25);color:#00f5c4;border-radius:8px;width:30px;height:30px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .refresh-btn:hover{background:rgba(0,245,196,.22)}

  .sidebar-search{padding:10px 12px;border-bottom:1px solid #1e293b}
  .search-input{width:100%;padding:8px 12px;background:#111c2e;border:1px solid #1e293b;border-radius:20px;color:#e2e8f0;font-family:'Syne',sans-serif;font-size:12px;outline:none;transition:border .2s}
  .search-input:focus{border-color:#00f5c4}
  .search-input::placeholder{color:#334155}

  .user-list{flex:1;overflow-y:auto;padding:6px 0;scrollbar-width:thin;scrollbar-color:#1e293b transparent}

  .loading-wrap{display:flex;justify-content:center;gap:6px;padding:24px 0}
  .dot{width:8px;height:8px;border-radius:50%;background:#00f5c4;animation:blink 1.2s ease infinite}
  .dot:nth-child(2){animation-delay:.2s}
  .dot:nth-child(3){animation-delay:.4s}

  .empty-state{display:flex;flex-direction:column;align-items:center;padding:32px 16px;gap:8px;color:#475569;text-align:center}
  .empty-state p{margin:0;font-size:12px;line-height:1.5}

  .user-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-left:3px solid transparent;transition:all .15s;position:relative}
  .user-item:hover{background:#111c2e}
  .user-item.active{background:#0f2340;border-left-color:#00f5c4}

  .avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#00f5c4,#3b82f6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:#080c14;flex-shrink:0}
  .avatar.lg{width:42px;height:42px;font-size:18px}

  .user-info{display:flex;flex-direction:column;min-width:0;flex:1}
  .user-name{font-size:13px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .user-email{font-size:11px;color:#64748b;font-family:'DM Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}

  .active-pip{width:8px;height:8px;border-radius:50%;background:#00f5c4;flex-shrink:0;box-shadow:0 0 6px #00f5c4}

  .sidebar-footer{padding:10px 14px;border-top:1px solid #1e293b;font-size:11px;color:#334155;font-family:'DM Mono',monospace;text-align:center}

  /* chat */
  .msg-chat{flex:1;display:flex;flex-direction:column;min-width:0}
  .no-chat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:0 32px}

  .chat-header{padding:14px 20px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:14px;background:#0d1320}
  .chat-name{font-size:15px;font-weight:700;color:#f1f5f9}
  .chat-email{font-size:11px;color:#64748b;font-family:'DM Mono',monospace}
  .listen-btn{margin-left:auto;display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:24px;background:#0f2340;border:1px solid #00f5c4;color:#00f5c4;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;font-weight:600;transition:all .2s;white-space:nowrap}
  .listen-btn:hover{background:#00f5c4;color:#080c14}

  .msg-list{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:#1e293b transparent}
  .empty-hint{color:#475569;font-size:13px;text-align:center;padding:20px}

  .bubble-wrap{display:flex;animation:fadeIn .2s ease}
  .bubble-wrap.mine{justify-content:flex-end}
  .bubble-wrap.theirs{justify-content:flex-start}
  .bubble{max-width:65%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5}
  .bubble p{margin:0 0 4px}
  .bubble-mine{background:#0f2e4a;border-bottom-right-radius:4px;color:#e2e8f0}
  .bubble-theirs{background:#1e293b;border-bottom-left-radius:4px;color:#cbd5e1}
  .bubble-time{font-size:10px;color:#475569;font-family:'DM Mono',monospace}

  .listen-card{max-width:260px;padding:14px 16px;border-radius:16px;display:flex;flex-direction:column;gap:8px;border:1px solid #00f5c4}
  .listen-card-mine{background:#051a2b}
  .listen-card-theirs{background:#0b1e2d}
  .lc-top{display:flex;align-items:center;gap:8px}
  .lc-label{font-size:11px;color:#00f5c4;font-weight:700;text-transform:uppercase;letter-spacing:.8px;font-family:'DM Mono',monospace}
  .lc-track{font-size:14px;font-weight:700;color:#e2e8f0;margin:0}
  .lc-accept{padding:7px 14px;background:#00f5c4;color:#080c14;border:none;border-radius:20px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;transition:opacity .2s;align-self:flex-start}
  .lc-accept:hover{opacity:.85}
  .lc-sent{font-size:12px;color:#475569;font-family:'DM Mono',monospace}

  .msg-input-row{padding:14px 20px;border-top:1px solid #1e293b;display:flex;gap:10px;background:#0d1320}
  .msg-input{flex:1;background:#111c2e;border:1px solid #1e293b;border-radius:24px;padding:10px 18px;color:#e2e8f0;font-family:'Syne',sans-serif;font-size:14px;outline:none;transition:border .2s}
  .msg-input:focus{border-color:#00f5c4}
  .send-btn{padding:10px 20px;background:#00f5c4;color:#080c14;border:none;border-radius:24px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;font-size:14px;transition:opacity .2s}
  .send-btn:hover{opacity:.85}

  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:2000;backdrop-filter:blur(4px)}
  .modal{background:#0d1320;border:1px solid #1e293b;border-radius:20px;padding:28px 32px;width:360px;display:flex;flex-direction:column;gap:16px;animation:fadeIn .3s ease}
  .pulse-border{animation:pulse-ring 1.5s ease infinite,fadeIn .3s ease;border-color:#00f5c4 !important}
  .modal-header{display:flex;align-items:center;gap:12px}
  .modal-header h3{margin:0;font-size:18px;color:#00f5c4}
  .modal-sub{margin:0;font-size:13px;color:#94a3b8;line-height:1.6}
  .invite-track{display:flex;align-items:center;gap:10px;background:#111c2e;padding:12px 16px;border-radius:12px;border:1px solid #1e293b}
  .invite-track span{font-size:14px;font-weight:700}
  .track-select{background:#111c2e;border:1px solid #1e293b;border-radius:10px;padding:10px 14px;color:#e2e8f0;font-family:'Syne',sans-serif;font-size:14px;outline:none;width:100%;cursor:pointer}
  .modal-actions{display:flex;gap:10px;justify-content:flex-end}
  .btn-cancel{padding:9px 18px;background:transparent;border:1px solid #334155;border-radius:20px;color:#94a3b8;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;transition:all .2s}
  .btn-cancel:hover{border-color:#ef4444;color:#ef4444}
  .btn-send{padding:9px 18px;background:#00f5c4;color:#080c14;border:none;border-radius:20px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;transition:opacity .2s}
  .btn-send:hover{opacity:.85}
  .btn-send:disabled{opacity:.4;cursor:not-allowed}

  .session-bar{position:fixed;bottom:0;left:0;right:0;background:#0d1320;border-top:1px solid #00f5c4;padding:10px 24px;display:flex;align-items:center;gap:20px;z-index:1500;box-shadow:0 -4px 30px rgba(0,245,196,.08)}
  .session-left{display:flex;align-items:center;gap:12px;min-width:200px}
  .session-track{font-size:14px;font-weight:700;color:#e2e8f0}
  .session-with{font-size:11px;color:#00f5c4;font-family:'DM Mono',monospace}
  .session-center{flex:1;display:flex;align-items:center;gap:10px;max-width:500px}
  .sc-btn{background:#00f5c4;color:#080c14;border:none;width:36px;height:36px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .sc-bar{flex:1;accent-color:#00f5c4}
  .sc-time{font-size:11px;color:#64748b;font-family:'DM Mono',monospace;min-width:32px}
  .session-close{background:transparent;border:1px solid #334155;color:#94a3b8;padding:6px 14px;border-radius:16px;cursor:pointer;font-family:'Syne',sans-serif;font-size:12px;transition:all .2s;white-space:nowrap}
  .session-close:hover{border-color:#ef4444;color:#ef4444}
`;