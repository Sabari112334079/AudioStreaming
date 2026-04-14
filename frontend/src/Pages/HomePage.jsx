import { useEffect, useRef, useState, useCallback } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
if (!document.querySelector("#hp2-styles")) {
  const s = document.createElement("style");
  s.id = "hp2-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

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

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .hp-root {
      min-height: 100vh;
      background: var(--bg);
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      overflow-x: hidden;
      padding-bottom: 110px;
    }

    /* ────────────────────────────────────────────────
       HERO
    ──────────────────────────────────────────────── */
    .hp-hero {
      position: relative;
      padding: 56px 40px 48px;
      overflow: hidden;
      background: linear-gradient(180deg, #140826 0%, #0d0d18 60%, transparent 100%);
    }
    .hp-hero::before {
      content: '';
      position: absolute; top: -140px; left: -100px;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%);
      pointer-events: none;
    }
    .hp-hero::after {
      content: '';
      position: absolute; top: -60px; right: -80px;
      width: 480px; height: 480px;
      background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%);
      pointer-events: none;
    }
    .hp-hero-inner { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; }
    .hp-hero-eyebrow {
      font-size: 11px; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      color: var(--accent2); margin-bottom: 14px;
      font-family: 'DM Mono', monospace;
      display: flex; align-items: center; gap: 8px;
    }
    .hp-hero-eyebrow::before {
      content: '';
      display: inline-block; width: 24px; height: 2px;
      background: var(--accent2);
    }
    .hp-hero-title {
      font-size: clamp(36px, 5vw, 64px);
      font-weight: 900;
      letter-spacing: -2px;
      line-height: 0.95;
      margin-bottom: 18px;
    }
    .hp-hero-title span.grad {
      background: linear-gradient(135deg, #fff 30%, #a78bfa 70%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hp-hero-title span.dim { color: rgba(255,255,255,0.18); }
    .hp-hero-sub {
      font-size: 15px; color: var(--muted); max-width: 480px; line-height: 1.6; margin-bottom: 32px;
    }
    .hp-hero-stats {
      display: flex; gap: 32px; flex-wrap: wrap;
    }
    .hp-hero-stat-num {
      font-size: 26px; font-weight: 800; letter-spacing: -1px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hp-hero-stat-lbl {
      font-size: 11px; color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.7px; font-family: 'DM Mono', monospace; margin-top: 2px;
    }

    /* Search bar */
    .hp-search-bar {
      position: relative; max-width: 480px; margin-top: 32px;
    }
    .hp-search-bar input {
      width: 100%;
      padding: 13px 20px 13px 46px;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border);
      border-radius: 14px;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px; outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .hp-search-bar input:focus {
      border-color: var(--accent);
      background: rgba(124,58,237,0.07);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }
    .hp-search-bar input::placeholder { color: var(--muted); }
    .hp-search-icon {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      font-size: 16px; pointer-events: none;
    }

    /* ────────────────────────────────────────────────
       SECTION STRUCTURE
    ──────────────────────────────────────────────── */
    .hp-section { padding: 0 40px; margin-bottom: 48px; }
    .hp-section-head {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 20px; gap: 12px;
    }
    .hp-section-title {
      font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
      color: var(--text); display: flex; align-items: center; gap: 10px;
    }
    .hp-section-title .icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2));
      border: 1px solid rgba(124,58,237,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 15px;
    }
    .hp-section-meta { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; }
    .hp-see-all {
      font-size: 12px; font-weight: 600; color: var(--accent2);
      background: none; border: none; cursor: pointer;
      font-family: 'Outfit', sans-serif;
      display: flex; align-items: center; gap: 4px;
      transition: opacity 0.2s; white-space: nowrap; padding: 0;
    }
    .hp-see-all:hover { opacity: 0.7; }

    /* Genre filter pills */
    .hp-genres {
      display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;
    }
    .hp-genre-btn {
      padding: 7px 16px; border-radius: 20px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      color: var(--muted);
      font-family: 'Outfit', sans-serif;
      font-size: 12px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .hp-genre-btn:hover { border-color: var(--accent); color: var(--text); }
    .hp-genre-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

    /* Horizontal scroll shelf */
    .hp-shelf {
      display: flex; gap: 16px;
      overflow-x: auto; padding-bottom: 8px;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
    }
    .hp-shelf::-webkit-scrollbar { display: none; }
    .hp-shelf > * { scroll-snap-align: start; flex-shrink: 0; }

    /* ────────────────────────────────────────────────
       SONG CARDS (horizontal shelf)
    ──────────────────────────────────────────────── */
    .hp-song-card {
      width: 200px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s, border-color 0.2s;
      animation: hpFadeUp 0.5s ease both;
    }
    .hp-song-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.55);
      border-color: rgba(124,58,237,0.35);
    }
    .hp-song-card.active {
      border-color: var(--accent);
      box-shadow: 0 0 0 1px var(--accent), 0 16px 40px rgba(124,58,237,0.3);
    }
    .hp-song-thumb {
      position: relative; width: 100%; aspect-ratio: 1; overflow: hidden;
      background: linear-gradient(135deg, #1e1030 0%, #0f1a2e 100%);
    }
    .hp-song-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; display: block; }
    .hp-song-card:hover .hp-song-thumb img { transform: scale(1.07); }
    .hp-song-thumb-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 44px;
    }
    .hp-song-thumb-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.2s;
    }
    .hp-song-card:hover .hp-song-thumb-overlay,
    .hp-song-card.active .hp-song-thumb-overlay { opacity: 1; }
    .hp-play-circle {
      width: 44px; height: 44px;
      background: var(--accent); border: none; border-radius: 50%;
      color: #fff; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 6px 20px rgba(124,58,237,0.5);
      transition: transform 0.2s;
    }
    .hp-play-circle:hover { transform: scale(1.1); }
    .hp-eq-badge {
      position: absolute; bottom: 8px; right: 8px;
      display: flex; align-items: flex-end; gap: 2px; height: 16px;
    }
    .hp-eq-b {
      width: 3px; background: var(--accent2); border-radius: 2px;
      animation: hpEq 0.7s ease-in-out infinite alternate;
    }
    .hp-eq-b:nth-child(1) { animation-delay: 0s; }
    .hp-eq-b:nth-child(2) { animation-delay: 0.15s; }
    .hp-eq-b:nth-child(3) { animation-delay: 0.3s; }
    .hp-song-info { padding: 12px 13px 13px; }
    .hp-song-name {
      font-size: 13px; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 3px; color: var(--text);
    }
    .hp-song-artist { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px; }
    .hp-song-meta { display: flex; align-items: center; justify-content: space-between; }
    .hp-song-stats { font-size: 10px; color: var(--subtle); font-family: 'DM Mono', monospace; display: flex; gap: 8px; }
    .hp-genre-pill {
      font-size: 9px; font-weight: 700;
      padding: 2px 7px; border-radius: 10px;
      background: rgba(124,58,237,0.2); color: #a78bfa;
      text-transform: uppercase; letter-spacing: 0.4px;
    }

    /* Mini progress inside active card */
    .hp-song-progress {
      padding: 0 13px 12px;
      display: none;
    }
    .hp-song-card.active .hp-song-progress { display: block; }
    .hp-prog-track {
      height: 3px; background: rgba(255,255,255,0.1); border-radius: 99px;
      overflow: hidden; cursor: pointer;
    }
    .hp-prog-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      border-radius: 99px; transition: width 0.1s linear;
    }
    .hp-prog-times { display: flex; justify-content: space-between; margin-top: 4px; }
    .hp-prog-t { font-size: 9px; color: var(--muted); font-family: 'DM Mono', monospace; }

    /* ────────────────────────────────────────────────
       PLAYLIST CARDS (horizontal shelf)
    ──────────────────────────────────────────────── */
    .hp-pl-card {
      width: 185px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px; overflow: hidden;
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s, border-color 0.2s;
      animation: hpFadeUp 0.5s ease both;
    }
    .hp-pl-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border-color: rgba(6,182,212,0.3);
    }
    .hp-pl-card.active-pl { border-color: var(--accent2); box-shadow: 0 0 0 1px var(--accent2), 0 16px 40px rgba(6,182,212,0.2); }
    .hp-pl-thumb {
      position: relative; width: 100%; aspect-ratio: 1;
      overflow: hidden; background: linear-gradient(135deg, #0f1a2e, #1e1030);
    }
    .hp-pl-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; display: block; }
    .hp-pl-card:hover .hp-pl-thumb img { transform: scale(1.06); }
    .hp-pl-thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 44px; }
    .hp-pl-thumb-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.2s;
    }
    .hp-pl-card:hover .hp-pl-thumb-overlay,
    .hp-pl-card.active-pl .hp-pl-thumb-overlay { opacity: 1; }
    .hp-play-circle-teal {
      width: 44px; height: 44px;
      background: var(--accent2); border: none; border-radius: 50%;
      color: #fff; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 6px 20px rgba(6,182,212,0.4);
      transition: transform 0.2s;
    }
    .hp-play-circle-teal:hover { transform: scale(1.1); }
    .hp-pl-info { padding: 12px 13px 13px; }
    .hp-pl-name { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
    .hp-pl-count { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; }
    .hp-pl-playing-badge {
      position: absolute; bottom: 8px; left: 8px;
      background: rgba(6,182,212,0.9); color: #0a0a0f;
      font-size: 9px; font-weight: 800;
      padding: 2px 8px; border-radius: 10px;
      letter-spacing: 0.5px; text-transform: uppercase;
    }

    /* ────────────────────────────────────────────────
       ARTIST CARDS (horizontal shelf)
    ──────────────────────────────────────────────── */
    .hp-artist-card {
      width: 150px; text-align: center; cursor: pointer;
      animation: hpFadeUp 0.5s ease both;
      flex-shrink: 0;
    }
    .hp-artist-avatar-wrap { position: relative; display: inline-block; margin-bottom: 10px; }
    .hp-artist-avatar {
      width: 110px; height: 110px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 38px; font-weight: 800; color: #fff;
      overflow: hidden;
      border: 2px solid var(--border);
      transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s, border-color 0.2s;
      margin: 0 auto;
    }
    .hp-artist-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .hp-artist-card:hover .hp-artist-avatar {
      transform: scale(1.06);
      box-shadow: 0 12px 36px rgba(124,58,237,0.4);
      border-color: var(--accent);
    }
    .hp-artist-mode-dot {
      position: absolute; bottom: 5px; right: 5px;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--card); border: 2px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px;
    }
    .hp-artist-name { font-size: 13px; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 8px; }
    .hp-artist-tracks { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; margin-top: 3px; }

    /* ────────────────────────────────────────────────
       FEATURED TRACK (big hero card)
    ──────────────────────────────────────────────── */
    .hp-featured {
      margin: 0 40px 48px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      min-height: 200px;
      position: relative;
      animation: hpFadeUp 0.5s ease both;
    }
    .hp-featured:hover { border-color: rgba(124,58,237,0.3); }
    .hp-featured-art {
      width: 220px; flex-shrink: 0;
      background: linear-gradient(135deg, #1e1030, #0f1a2e);
      position: relative; overflow: hidden;
    }
    .hp-featured-art img { width: 100%; height: 100%; object-fit: cover; }
    .hp-featured-art-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 72px; }
    .hp-featured-glow {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent 60%, var(--card) 100%);
    }
    .hp-featured-body { flex: 1; padding: 28px 32px;  flex-direction: column; justify-content: center; }
    .hp-featured-tag {
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--accent2); font-family: 'DM Mono', monospace; margin-bottom: 10px;
      display: flex; align-items: center; gap: 6px;
    }
    .hp-featured-tag::before { content: ''; width: 16px; height: 2px; background: var(--accent2); display: inline-block; }
    .hp-featured-title { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
    .hp-featured-artist { font-size: 14px; color: var(--muted); margin-bottom: 16px; }
    .hp-featured-stats { display: flex; gap: 20px; margin-bottom: 20px; }
    .hp-featured-stat { font-size: 12px; color: var(--subtle); font-family: 'DM Mono', monospace; display: flex; align-items: center; gap: 4px; }
    .hp-featured-play {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 11px 22px;
      background: linear-gradient(135deg, var(--accent), #6d28d9);
      border: none; border-radius: 12px;
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 700; cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 18px rgba(124,58,237,0.4);
      align-self: flex-start;
    }
    .hp-featured-play:hover { opacity: 0.88; transform: translateY(-1px); }

    /* ────────────────────────────────────────────────
       NOW PLAYING BAR
    ──────────────────────────────────────────────── */
    .hp-np-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      height: 80px;
      background: rgba(10,10,15,0.96);
      backdrop-filter: blur(24px);
      border-top: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 28px; gap: 20px; z-index: 200;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
    }
    .hp-np-cover {
      width: 50px; height: 50px; border-radius: 10px;
      object-fit: cover; flex-shrink: 0;
      border: 1px solid var(--border);
    }
    .hp-np-cover-ph {
      width: 50px; height: 50px; border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0;
    }
    .hp-np-info { min-width: 0; flex: 0 0 180px; }
    .hp-np-title { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .hp-np-artist { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
    .hp-np-center {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
      max-width: 520px; margin: 0 auto;
    }
    .hp-np-controls { display: flex; align-items: center; gap: 14px; }
    .hp-np-btn {
      background: none; border: none; color: var(--muted);
      font-size: 18px; cursor: pointer; padding: 4px;
      transition: color 0.15s;
    }
    .hp-np-btn:hover { color: var(--text); }
    .hp-np-play {
      width: 36px; height: 36px;
      background: var(--text); border: none; border-radius: 50%;
      color: var(--bg); font-size: 15px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, background 0.15s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .hp-np-play:hover { transform: scale(1.08); background: #e2e8f0; }
    .hp-np-prog-row { width: 100%; display: flex; align-items: center; gap: 10px; }
    .hp-np-time { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; min-width: 30px; }
    .hp-np-prog {
      flex: 1; -webkit-appearance: none; height: 4px;
      background: rgba(255,255,255,0.1); border-radius: 99px;
      outline: none; cursor: pointer;
    }
    .hp-np-prog::-webkit-slider-thumb {
      -webkit-appearance: none; width: 12px; height: 12px;
      border-radius: 50%; background: var(--accent); cursor: pointer;
    }
    .hp-np-right { flex: 0 0 160px; display: flex; justify-content: flex-end; align-items: center; gap: 10px; }
    .hp-np-vol {
      width: 70px; -webkit-appearance: none; height: 3px;
      background: rgba(255,255,255,0.1); border-radius: 99px; outline: none; cursor: pointer;
    }
    .hp-np-vol::-webkit-slider-thumb {
      -webkit-appearance: none; width: 11px; height: 11px;
      border-radius: 50%; background: var(--accent2); cursor: pointer;
    }
    .hp-np-close {
      background: none; border: none; color: var(--muted);
      font-size: 14px; cursor: pointer; padding: 4px;
      transition: color 0.15s;
    }
    .hp-np-close:hover { color: var(--red); }

    /* ────────────────────────────────────────────────
       STATES
    ──────────────────────────────────────────────── */
    .hp-loading-spin {
      width: 36px; height: 36px;
      border: 3px solid rgba(124,58,237,0.2);
      border-top-color: var(--accent); border-radius: 50%;
      animation: hpSpin 0.8s linear infinite;
    }
    .hp-section-loading { display: flex; gap: 10px; align-items: center; padding: 20px 0; }
    .hp-section-loading span { font-size: 13px; color: var(--muted); }
    .hp-section-empty { font-size: 13px; color: var(--muted); padding: 20px 0; text-align: center; }

    /* Divider */
    .hp-divider {
      margin: 0 40px 40px;
      height: 1px; background: var(--border);
    }

    @keyframes hpFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes hpSpin   { to { transform: rotate(360deg); } }
    @keyframes hpEq     { from { transform: scaleY(0.3); } to { transform: scaleY(1.3); } }

    @media (max-width: 640px) {
      .hp-hero { padding: 36px 20px 32px; }
      .hp-section { padding: 0 16px; }
      .hp-featured { margin: 0 16px 36px; flex-direction: column; }
      .hp-featured-art { width: 100%; height: 180px; }
      .hp-divider { margin: 0 16px 32px; }
    }
  `;
  document.head.appendChild(s);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (s) => {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

// ─── Per-card audio hook ──────────────────────────────────────────────────────
const useCardAudio = (src) => {
  const ref   = useRef(null);
  const [playing,  setPlaying]  = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume,   setVolume]   = useState(0.8);

  useEffect(() => {
    const a = new Audio(src);
    a.volume = volume; a.preload = "metadata";
    ref.current = a;
    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    a.addEventListener("timeupdate",     () => setCurrent(a.currentTime));
    a.addEventListener("ended",          () => setPlaying(false));
    return () => { a.pause(); a.src = ""; };
  }, [src]);

  const toggle = useCallback(() => {
    const a = ref.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play().catch(() => {}); setPlaying(true); }
  }, [playing]);

  const seek = useCallback((pct) => {
    const a = ref.current; if (!a || !duration) return;
    a.currentTime = pct * duration;
  }, [duration]);

  const pause = useCallback(() => { ref.current?.pause(); setPlaying(false); }, []);

  return { playing, current, duration, volume, toggle, seek, pause, setVolume, ref };
};

// ─── SongCard ─────────────────────────────────────────────────────────────────
const SongCard = ({ song, isActive, onActivate, onDeactivate, delay }) => {
  const src    = `http://localhost:5000/uploads/audio/${song.filename}`;
  const player = useCardAudio(src);
  const pct    = player.duration ? (player.current / player.duration) * 100 : 0;

  useEffect(() => { if (!isActive && player.playing) player.pause(); }, [isActive]);

  const handleClick = () => {
    if (isActive) { player.toggle(); }
    else { onActivate(song._id, player); if (!player.playing) player.toggle(); }
  };

  const handleClose = (e) => { e.stopPropagation(); player.pause(); onDeactivate(); };

  return (
    <div
      className={`hp-song-card${isActive ? " active" : ""}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={handleClick}
    >
      <div className="hp-song-thumb">
        {song.coverArt
          ? <img src={song.coverArt} alt={song.title} loading="lazy" />
          : <div className="hp-song-thumb-placeholder">🎵</div>}
        <div className="hp-song-thumb-overlay">
          <button className="hp-play-circle" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            {player.playing ? "⏸" : "▶"}
          </button>
        </div>
        {player.playing && (
          <div className="hp-eq-badge">
            {[5,8,11,7].map((h,i) => <div key={i} className="hp-eq-b" style={{ height: `${h}px` }} />)}
          </div>
        )}
        {isActive && (
          <button
            onClick={handleClose}
            style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
          >✕</button>
        )}
      </div>
      <div className="hp-song-info">
        <div className="hp-song-name" title={song.title}>{song.title}</div>
        <div className="hp-song-artist">🎤 {song.artist || "Unknown"}</div>
        <div className="hp-song-meta">
          <div className="hp-song-stats">
            <span>▶ {(song.plays || 0).toLocaleString()}</span>
            <span>♥ {(song.likes || 0).toLocaleString()}</span>
          </div>
          {song.genre && <span className="hp-genre-pill">{song.genre}</span>}
        </div>
      </div>
      <div className="hp-song-progress">
        <div className="hp-prog-track" onClick={(e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); player.seek((e.clientX - r.left) / r.width); }}>
          <div className="hp-prog-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="hp-prog-times">
          <span className="hp-prog-t">{fmt(player.current)}</span>
          <span className="hp-prog-t">{fmt(player.duration)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── PlaylistCard ─────────────────────────────────────────────────────────────
const PlaylistCard = ({ pl, isActive, onPlay, delay }) => (
  <div className={`hp-pl-card${isActive ? " active-pl" : ""}`} style={{ animationDelay: `${delay}s` }}>
    <div className="hp-pl-thumb">
      {pl.coverUrl
        ? <img src={pl.coverUrl} alt={pl.title} onError={e => { e.target.src = `https://picsum.photos/seed/${pl._id}/400/400`; }} loading="lazy" />
        : <div className="hp-pl-thumb-placeholder">🎧</div>}
      {isActive && <div className="hp-pl-playing-badge">▶ Playing</div>}
      <div className="hp-pl-thumb-overlay">
        <button className="hp-play-circle-teal" onClick={() => onPlay(pl)}>
          {isActive ? "⏸" : "▶"}
        </button>
      </div>
    </div>
    <div className="hp-pl-info">
      <div className="hp-pl-name">{pl.title}</div>
      <div className="hp-pl-count">{pl.tracks?.length || 0} tracks</div>
    </div>
  </div>
);

// ─── ArtistCard ───────────────────────────────────────────────────────────────
const ArtistCard = ({ artist, delay }) => (
  <div className="hp-artist-card" style={{ animationDelay: `${delay}s` }}>
    <div className="hp-artist-avatar-wrap">
      <div className="hp-artist-avatar">
        {artist.avatar ? <img src={artist.avatar} alt={artist.name} /> : (artist.name?.charAt(0)?.toUpperCase() || "?")}
      </div>
      <div className="hp-artist-mode-dot">🎤</div>
    </div>
    <div className="hp-artist-name">{artist.name || "Unknown"}</div>
    <div className="hp-artist-tracks">{artist.totalTracks || 0} tracks</div>
  </div>
);

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [songs,     setSongs]     = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artists,   setArtists]   = useState([]);
  const [loading,   setLoading]   = useState({ songs: true, playlists: true, artists: true });
  const [genres,    setGenres]    = useState(["all"]);
  const [genre,     setGenre]     = useState("all");
  const [search,    setSearch]    = useState("");
  const [searchInput, setSearchInput] = useState("");
  const searchTimer = useRef(null);

  // Active song player
  const [activeId,     setActiveId]     = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);

  // Playlist player
  const [activePl,         setActivePl]         = useState(null);
  const [plTrackIdx,       setPlTrackIdx]        = useState(0);
  const [plPlaying,        setPlPlaying]         = useState(false);
  const [plProgress,       setPlProgress]        = useState(0);
  const [plDuration,       setPlDuration]        = useState(0);
  const [plVolume,         setPlVolume]          = useState(0.85);
  const plAudioRef = useRef(null);

  useEffect(() => { fetchSongs(); },      [genre, search]);
  useEffect(() => { fetchPlaylists(); fetchArtists(); }, []);

  // Playlist audio management
  useEffect(() => {
    if (!activePl) return;
    const track = activePl.tracks[plTrackIdx];
    if (!track || !plAudioRef.current) return;
    plAudioRef.current.src = `http://localhost:5000/uploads/audio/${track.filename}`;
    plAudioRef.current.load();
    plAudioRef.current.play().then(() => setPlPlaying(true)).catch(() => setPlPlaying(false));
  }, [plTrackIdx, activePl]);

  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }));

  const fetchSongs = async () => {
    setLoad("songs", true);
    try {
      const q = new URLSearchParams();
      if (genre !== "all") q.append("genre", genre);
      if (search) q.append("search", search);
      const res  = await fetch(`http://localhost:5000/songs?${q}`);
      const data = await res.json();
      const arr  = Array.isArray(data.songs) ? data.songs : [];
      setSongs(arr);
      const g = [...new Set(arr.map(s => s.genre))].filter(Boolean);
      setGenres(["all", ...g]);
    } catch { setSongs([]); }
    finally { setLoad("songs", false); }
  };

  const fetchPlaylists = async () => {
    setLoad("playlists", true);
    try {
      const res  = await fetch("http://localhost:5000/add-playlists", { credentials: "include" });
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch { setPlaylists([]); }
    finally { setLoad("playlists", false); }
  };

 const fetchArtists = async () => {
  setLoad("artists", true);
  try {
    // ✅ Add credentials to send session cookie
    const res = await fetch("http://localhost:5000/users?role=Artist", {
      credentials: "include",  // ← THIS WAS MISSING!
      headers: { "Content-Type": "application/json" },
    });
    
    // ✅ Handle non-JSON responses safely
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }
    
    const data = await res.json();
    
    if (res.ok) {
      const all = data.users || data || [];
      setArtists(Array.isArray(all) ? all.filter(u => u.mode === "Artist") : []);
    } else {
      console.warn("Fetch artists failed:", data.message);
      setArtists([]);
    }
  } catch (err) {
    console.error("Failed to fetch artists:", err.message);
    setArtists([]);
  } finally {
    setLoad("artists", false);
  }
};

  const handleSearchInput = (v) => {
    setSearchInput(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(v), 420);
  };

  const handleActivateSong = (id, player) => {
    if (activePlayer && activeId !== id) activePlayer.pause();
    // Pause playlist if active
    if (activePl) { plAudioRef.current?.pause(); setPlPlaying(false); }
    setActiveId(id); setActivePlayer(player);
  };
  const handleDeactivateSong = () => { setActiveId(null); setActivePlayer(null); };

  const handlePlayPlaylist = (pl) => {
    // Pause song player
    if (activePlayer) { activePlayer.pause(); setActiveId(null); setActivePlayer(null); }
    if (activePl?._id === pl._id) {
      if (plPlaying) { plAudioRef.current?.pause(); setPlPlaying(false); }
      else { plAudioRef.current?.play().then(() => setPlPlaying(true)).catch(() => {}); }
      return;
    }
    if (!pl.tracks?.length) return;
    setActivePl(pl); setPlTrackIdx(0); setPlProgress(0); setPlDuration(0);
  };
  const closePlPlayer = () => {
    plAudioRef.current?.pause();
    setActivePl(null); setPlPlaying(false); setPlProgress(0); setPlDuration(0);
  };

  const featured = songs[0] || null;
  const totalStats = { songs: songs.length, playlists: playlists.length, artists: artists.length };
  const currentPlTrack = activePl?.tracks[plTrackIdx];

  // Which NP bar to show: playlist takes priority
  const showNP = activePl || activeId;
  const npSong = songs.find(s => s._id === activeId);

  return (
    <div className="hp-root">
      {/* Playlist audio element */}
      <audio
        ref={plAudioRef}
        onTimeUpdate={() => plAudioRef.current && setPlProgress(plAudioRef.current.currentTime)}
        onLoadedMetadata={() => plAudioRef.current && setPlDuration(plAudioRef.current.duration)}
        onEnded={() => {
          if (activePl && plTrackIdx < activePl.tracks.length - 1) setPlTrackIdx(i => i + 1);
          else { setPlPlaying(false); setPlProgress(0); }
        }}
      />

      {/* ── HERO ── */}
      <div className="hp-hero">
        <div className="hp-hero-inner">
          <div className="hp-hero-eyebrow">Your Music Hub</div>
          <h1 className="hp-hero-title">
            <span className="grad">Feel Every</span><br/>
            <span className="dim">Beat</span>
          </h1>
          <p className="hp-hero-sub">Discover tracks, explore playlists, and connect with artists from the community.</p>
          <div className="hp-hero-stats">
            {[
              { n: totalStats.songs,     l: "Tracks" },
              { n: totalStats.playlists, l: "Playlists" },
              { n: totalStats.artists,   l: "Artists" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="hp-hero-stat-num">{n}</div>
                <div className="hp-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
          <div className="hp-search-bar">
            <span className="hp-search-icon">🔍</span>
            <input
              type="text" placeholder="Search tracks, artists…"
              value={searchInput} onChange={e => handleSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── FEATURED TRACK ── */}
      {featured && !loading.songs && (
        <div className="hp-featured">
          <div className="hp-featured-art">
            {featured.coverArt
              ? <img src={featured.coverArt} alt={featured.title} />
              : <div className="hp-featured-art-placeholder">🎵</div>}
            <div className="hp-featured-glow" />
          </div>
          <div className="hp-featured-body">
            <div className="hp-featured-tag">Featured Track</div>
            <div className="hp-featured-title">{featured.title}</div>
            <div className="hp-featured-artist">🎤 {featured.artist || "Unknown Artist"}</div>
            <div className="hp-featured-stats">
              <span className="hp-featured-stat">▶ {(featured.plays || 0).toLocaleString()} plays</span>
              <span className="hp-featured-stat">♥ {(featured.likes || 0).toLocaleString()}</span>
              {featured.genre && <span className="hp-featured-stat">🎵 {featured.genre}</span>}
            </div>
            <button
              className="hp-featured-play"
              onClick={() => {
                const card = document.querySelector(`[data-song-id="${featured._id}"]`);
                handleActivateSong(featured._id, null);
              }}
            >
              ▶ Play Now
            </button>
          </div>
        </div>
      )}

      <div className="hp-divider" />

      {/* ── LATEST SONGS ── */}
      <div className="hp-section">
        <div className="hp-section-head">
          <div>
            <div className="hp-section-title">
              <span className="icon">🎵</span>
              Latest Tracks
            </div>
            <div className="hp-section-meta" style={{ marginTop: 4 }}>
              {loading.songs ? "Loading…" : `${songs.length} track${songs.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        {/* Genre pills */}
        <div className="hp-genres">
          {genres.map(g => (
            <button key={g} className={`hp-genre-btn${genre === g ? " active" : ""}`} onClick={() => setGenre(g)}>
              {g === "all" ? "All Genres" : g}
            </button>
          ))}
        </div>

        {loading.songs ? (
          <div className="hp-section-loading"><div className="hp-loading-spin" /><span>Loading tracks…</span></div>
        ) : songs.length === 0 ? (
          <div className="hp-section-empty">No tracks found — try adjusting your filters.</div>
        ) : (
          <div className="hp-shelf">
            {songs.map((song, i) => (
              <SongCard
                key={song._id}
                song={song}
                isActive={activeId === song._id}
                onActivate={handleActivateSong}
                onDeactivate={handleDeactivateSong}
                delay={Math.min(i * 0.05, 0.4)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hp-divider" />

      {/* ── PLAYLISTS ── */}
      <div className="hp-section">
        <div className="hp-section-head">
          <div>
            <div className="hp-section-title">
              <span className="icon">🎧</span>
              Playlists
            </div>
            <div className="hp-section-meta" style={{ marginTop: 4 }}>
              {loading.playlists ? "Loading…" : `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        {loading.playlists ? (
          <div className="hp-section-loading"><div className="hp-loading-spin" /><span>Loading playlists…</span></div>
        ) : playlists.length === 0 ? (
          <div className="hp-section-empty">No playlists yet.</div>
        ) : (
          <div className="hp-shelf">
            {playlists.map((pl, i) => (
              <PlaylistCard
                key={pl._id}
                pl={pl}
                isActive={activePl?._id === pl._id}
                onPlay={handlePlayPlaylist}
                delay={Math.min(i * 0.05, 0.4)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hp-divider" />

      {/* ── ARTISTS ── */}
      <div className="hp-section">
        <div className="hp-section-head">
          <div>
            <div className="hp-section-title">
              <span className="icon">🎤</span>
              Artists
            </div>
            <div className="hp-section-meta" style={{ marginTop: 4 }}>
              {loading.artists ? "Loading…" : `${artists.length} artist${artists.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        {loading.artists ? (
          <div className="hp-section-loading"><div className="hp-loading-spin" /><span>Loading artists…</span></div>
        ) : artists.length === 0 ? (
          <div className="hp-section-empty">No artists found.</div>
        ) : (
          <div className="hp-shelf" style={{ gap: "24px", paddingTop: 4 }}>
            {artists.map((a, i) => (
              <ArtistCard key={a._id || a.email} artist={a} delay={Math.min(i * 0.05, 0.4)} />
            ))}
          </div>
        )}
      </div>

      {/* ── NOW PLAYING BAR ── */}
      {showNP && (
        <div className="hp-np-bar">
          {/* Left: cover + info */}
          {activePl ? (
            <>
              {activePl.coverUrl
                ? <img src={activePl.coverUrl} alt="cover" className="hp-np-cover" onError={e => { e.target.style.display = "none"; }} />
                : <div className="hp-np-cover-ph">🎧</div>}
              <div className="hp-np-info">
                <div className="hp-np-title">{currentPlTrack?.title || "Unknown"}</div>
                <div className="hp-np-artist">{activePl.title}</div>
              </div>
            </>
          ) : npSong ? (
            <>
              {npSong.coverArt
                ? <img src={npSong.coverArt} alt="cover" className="hp-np-cover" />
                : <div className="hp-np-cover-ph">🎵</div>}
              <div className="hp-np-info">
                <div className="hp-np-title">{npSong.title}</div>
                <div className="hp-np-artist">{npSong.artist || "Unknown"}</div>
              </div>
            </>
          ) : null}

          {/* Center: controls + progress */}
          <div className="hp-np-center">
            {activePl ? (
              <>
                <div className="hp-np-controls">
                  <button className="hp-np-btn" onClick={() => plTrackIdx > 0 && setPlTrackIdx(i => i - 1)}>⏮</button>
                  <button className="hp-np-play" onClick={() => {
                    if (!plAudioRef.current) return;
                    if (plPlaying) { plAudioRef.current.pause(); setPlPlaying(false); }
                    else { plAudioRef.current.play().then(() => setPlPlaying(true)).catch(() => {}); }
                  }}>{plPlaying ? "⏸" : "▶"}</button>
                  <button className="hp-np-btn" onClick={() => activePl && plTrackIdx < activePl.tracks.length - 1 && setPlTrackIdx(i => i + 1)}>⏭</button>
                </div>
                <div className="hp-np-prog-row">
                  <span className="hp-np-time">{fmt(plProgress)}</span>
                  <input type="range" min={0} max={plDuration || 0} value={plProgress} onChange={e => {
                    const v = parseFloat(e.target.value);
                    if (plAudioRef.current) plAudioRef.current.currentTime = v;
                    setPlProgress(v);
                  }} className="hp-np-prog" />
                  <span className="hp-np-time" style={{ textAlign: "right" }}>{fmt(plDuration)}</span>
                </div>
              </>
            ) : activePlayer ? (
              <>
                <div className="hp-np-controls">
                  <button className="hp-np-play" onClick={activePlayer.toggle}>
                    {activePlayer.playing ? "⏸" : "▶"}
                  </button>
                </div>
                <div className="hp-np-prog-row">
                  <span className="hp-np-time">{fmt(activePlayer.current)}</span>
                  <input type="range" min={0} max={1} step={0.001}
                    value={activePlayer.duration ? activePlayer.current / activePlayer.duration : 0}
                    onChange={e => activePlayer.seek(parseFloat(e.target.value))}
                    className="hp-np-prog" />
                  <span className="hp-np-time" style={{ textAlign: "right" }}>{fmt(activePlayer.duration)}</span>
                </div>
              </>
            ) : null}
          </div>

          {/* Right: volume + close */}
          <div className="hp-np-right">
            <span style={{ fontSize: 13, color: "var(--muted)" }}>🔊</span>
            <input type="range" min={0} max={1} step={0.01}
              value={activePl ? plVolume : (activePlayer?.volume ?? 0.8)}
              onChange={e => {
                const v = parseFloat(e.target.value);
                if (activePl && plAudioRef.current) { plAudioRef.current.volume = v; setPlVolume(v); }
                else if (activePlayer) { activePlayer.setVolume(v); activePlayer.ref.current && (activePlayer.ref.current.volume = v); }
              }}
              className="hp-np-vol" />
            <button className="hp-np-close" onClick={() => {
              if (activePl) closePlPlayer();
              else { activePlayer?.pause(); setActiveId(null); setActivePlayer(null); }
            }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;