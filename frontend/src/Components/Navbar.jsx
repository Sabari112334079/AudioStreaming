import { useState, useEffect, useRef } from "react";

if (!document.querySelector("#nb-styles")) {
  const s = document.createElement("style");
  s.id = "nb-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

    .nb-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      height: 64px;
      background: rgba(10,10,15,0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: 'Outfit', sans-serif;
      gap: 16px;
    }

    /* ── Logo ── */
    .nb-logo {
      display: flex;
      align-items: center;
      gap: 9px;
      cursor: pointer;
      flex-shrink: 0;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .nb-logo:hover { opacity: 0.85; }
    .nb-logo-icon {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      box-shadow: 0 4px 14px rgba(124,58,237,0.4);
    }
    .nb-logo-text {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Nav links ── */
    .nb-links {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      justify-content: center;
    }
    .nb-link {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #94a3b8;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.2s, background 0.2s;
      border: none;
      background: none;
      font-family: 'Outfit', sans-serif;
      white-space: nowrap;
    }
    .nb-link:hover {
      color: #f1f5f9;
      background: rgba(255,255,255,0.07);
    }
    .nb-link.active {
      color: #f1f5f9;
      background: rgba(124,58,237,0.18);
    }
    .nb-link-icon { font-size: 15px; }

    /* ── Upload button ── */
    .nb-upload-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 14px rgba(124,58,237,0.35);
      white-space: nowrap;
    }
    .nb-upload-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(124,58,237,0.5);
    }

    /* ── Right section ── */
    .nb-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* ── Auth buttons ── */
    .nb-login-btn {
      padding: 8px 18px;
      border: 1px solid rgba(255,255,255,0.15);
      background: transparent;
      color: #cbd5e1;
      border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .nb-login-btn:hover {
      border-color: rgba(255,255,255,0.35);
      color: #fff;
      background: rgba(255,255,255,0.05);
    }
    .nb-signup-btn {
      padding: 8px 18px;
      background: #fff;
      border: none;
      color: #0a0a0f;
      border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }
    .nb-signup-btn:hover { opacity: 0.9; transform: translateY(-1px); }

    /* ── Profile ── */
    .nb-profile-wrap {
      position: relative;
    }
    .nb-avatar-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 10px 5px 5px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 40px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .nb-avatar-btn:hover {
      background: rgba(255,255,255,0.09);
      border-color: rgba(124,58,237,0.4);
    }
    .nb-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(124,58,237,0.5);
      flex-shrink: 0;
    }
    .nb-avatar-placeholder {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .nb-user-name {
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .nb-mode-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(124,58,237,0.25);
      color: #a78bfa;
      letter-spacing: 0.3px;
    }
    .nb-chevron {
      font-size: 11px;
      color: #64748b;
      transition: transform 0.2s;
    }
    .nb-chevron.open { transform: rotate(180deg); }

    /* ── Dropdown ── */
    .nb-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 240px;
      background: #16161f;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      overflow: hidden;
      animation: nbFadeDown 0.18s ease both;
    }
    .nb-dd-header {
      padding: 14px 16px;
      display: flex;
      gap: 12px;
      align-items: center;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .nb-dd-avatar {
      width: 42px; height: 42px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid rgba(124,58,237,0.4);
    }
    .nb-dd-avatar-placeholder {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .nb-dd-name {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nb-dd-email {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nb-dd-body { padding: 6px; }
    .nb-dd-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 500;
      color: #94a3b8;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      border: none;
      background: none;
      width: 100%;
      font-family: 'Outfit', sans-serif;
      text-align: left;
    }
    .nb-dd-item:hover { background: rgba(255,255,255,0.06); color: #f1f5f9; }
    .nb-dd-item.danger:hover { background: rgba(244,63,94,0.12); color: #f43f5e; }
    .nb-dd-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }

    @keyframes nbFadeDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .nb-nav { padding: 0 16px; }
      .nb-user-name { display: none; }
      .nb-link span:last-child { display: none; }
    }
  `;
  document.head.appendChild(s);
}

const Navbar = ({ setPage, isLoggedIn, setIsLoggedIn, setCurrentUser, currentUser, mode, currentPage }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPage("home");
    setShowDropdown(false);
  };

  const nav = (page) => {
    setPage(page);
    setShowDropdown(false);
  };

  const isActive = (page) => currentPage === page;

  return (
    <nav className="nb-nav">
      {/* Logo */}
      <div className="nb-logo" onClick={() => nav("home")}>
        <div className="nb-logo-icon">🎵</div>
        <span className="nb-logo-text">BabyTunes</span>
      </div>

      {/* Nav links */}
      <div className="nb-links">
        <button className={`nb-link${isActive("home") ? " active" : ""}`} onClick={() => nav("home")}>
          <span>Home</span>
        </button>

        <button className={`nb-link${isActive("playlists") ? " active" : ""}`} onClick={() => nav("playlists")}>
          <span>Playlists</span>
        </button>

        {isLoggedIn && (
          <button className={`nb-link${isActive("twintones") ? " active" : ""}`} onClick={() => nav("twintones")}>
            <span>Messages</span>
          </button>
        )}

        {isLoggedIn && mode === "Artist" && (
          <button className="nb-upload-btn" onClick={() => nav("upload")}>
            <span>⬆</span>
            <span>Upload</span>
          </button>
        )}
      </div>

      {/* Right section */}
      <div className="nb-right">
        {isLoggedIn ? (
          <div className="nb-profile-wrap" ref={dropdownRef}>
            <button className="nb-avatar-btn" onClick={() => setShowDropdown(!showDropdown)}>
              {currentUser?.avatar
                ? <img src={currentUser.avatar} alt="avatar" className="nb-avatar" />
                : <div className="nb-avatar-placeholder">👤</div>
              }
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                <span className="nb-user-name">{currentUser?.name || "User"}</span>
                <span className="nb-mode-badge">{mode}</span>
              </div>
              <span className={`nb-chevron${showDropdown ? " open" : ""}`}>▾</span>
            </button>

            {showDropdown && (
              <div className="nb-dropdown">
                <div className="nb-dd-header">
                  {currentUser?.avatar
                    ? <img src={currentUser.avatar} alt="avatar" className="nb-dd-avatar" />
                    : <div className="nb-dd-avatar-placeholder">👤</div>
                  }
                  <div style={{ minWidth: 0 }}>
                    <div className="nb-dd-name">{currentUser?.name}</div>
                    <div className="nb-dd-email">{currentUser?.email}</div>
                  </div>
                </div>

                <div className="nb-dd-body">
                  <button className="nb-dd-item" onClick={() => nav("profile")}>
                    <span>⚙️</span> Profile Settings
                  </button>
                  {mode === "Artist" && (
                    <button className="nb-dd-item" onClick={() => nav("upload")}>
                      <span>⬆️</span> Upload Track
                    </button>
                  )}
                  <div className="nb-dd-divider" />
                  <button className="nb-dd-item danger" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="nb-login-btn" onClick={() => nav("login")}>Login</button>
            <button className="nb-signup-btn" onClick={() => nav("register")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;