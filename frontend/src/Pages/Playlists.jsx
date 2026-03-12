import { useEffect, useRef, useState } from "react";

const API = "http://localhost:5000";

// ─── Styles ───────────────────────────────────────────────────────────────────
if (!document.querySelector("#pl-styles")) {
  const s = document.createElement("style");
  s.id = "pl-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

    .pl-root {
      min-height: 100vh;
      background: #0a0a0f;
      font-family: 'Outfit', sans-serif;
      color: #f1f5f9;
      padding-bottom: 120px;
    }

    /* ── Header ── */
    .pl-header {
      padding: 48px 32px 32px;
      background: linear-gradient(180deg, #1a0a2e 0%, transparent 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .pl-header::before {
      content: '';
      position: absolute;
      top: -120px; left: -120px;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .pl-header::after {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .pl-title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -1.5px;
      line-height: 1;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #fff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
    }
    .pl-subtitle {
      font-size: 14px;
      color: #64748b;
      position: relative;
    }
    .pl-new-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 18px rgba(124,58,237,0.4);
      position: relative;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .pl-new-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(124,58,237,0.55);
    }

    /* ── Body ── */
    .pl-body { padding: 28px 32px; }

    /* ── Error ── */
    .pl-error {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(244,63,94,0.1);
      border: 1px solid rgba(244,63,94,0.25);
      border-radius: 10px;
      padding: 12px 16px;
      color: #f43f5e;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .pl-retry-btn {
      margin-left: auto;
      padding: 4px 12px;
      background: rgba(244,63,94,0.2);
      border: 1px solid rgba(244,63,94,0.3);
      border-radius: 6px;
      color: #f43f5e;
      font-size: 12px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
    }

    /* ── Empty ── */
    .pl-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 14px;
    }
    .pl-empty-icon {
      font-size: 56px;
      opacity: 0.5;
    }
    .pl-empty-text {
      font-size: 15px;
      color: #64748b;
      text-align: center;
    }

    /* ── Loading ── */
    .pl-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      gap: 14px;
    }
    .pl-spin {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,0.08);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: plSpin 0.8s linear infinite;
    }
    @keyframes plSpin { to { transform: rotate(360deg); } }

    /* ── Grid ── */
    .pl-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }

    /* ── Card ── */
    .pl-card {
      background: #16161f;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
      transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
      animation: plFadeUp 0.4s ease both;
      display: flex;
      flex-direction: column;
    }
    .pl-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border-color: rgba(124,58,237,0.3);
      background: #1c1c28;
    }
    .pl-card.active {
      border-color: #7c3aed;
      box-shadow: 0 0 0 1px #7c3aed, 0 20px 50px rgba(124,58,237,0.25);
    }
    @keyframes plFadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Cover ── */
    .pl-card-cover {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      background: linear-gradient(135deg, #1e1030 0%, #0f1a2e 100%);
      flex-shrink: 0;
    }
    .pl-card-cover img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
      display: block;
    }
    .pl-card:hover .pl-card-cover img { transform: scale(1.06); }
    .pl-cover-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 52px;
      opacity: 0.5;
    }
    .pl-now-badge {
      position: absolute;
      bottom: 10px; left: 50%;
      transform: translateX(-50%);
      background: rgba(124,58,237,0.92);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      white-space: nowrap;
      letter-spacing: 0.4px;
      backdrop-filter: blur(6px);
    }
    .pl-cover-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .pl-card:hover .pl-cover-overlay,
    .pl-card.active .pl-cover-overlay { opacity: 1; }
    .pl-play-big {
      width: 52px; height: 52px;
      background: #7c3aed;
      border: none;
      border-radius: 50%;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, background 0.2s;
      box-shadow: 0 8px 24px rgba(124,58,237,0.5);
    }
    .pl-play-big:hover { transform: scale(1.1); background: #6d28d9; }

    /* ── Card body ── */
    .pl-card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .pl-card-title {
      font-size: 14px; font-weight: 700; color: #f1f5f9;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pl-card-desc {
      font-size: 12px; color: #64748b;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pl-card-count {
      font-size: 11px; color: #334155;
      font-family: 'DM Mono', monospace;
      margin-bottom: 2px;
    }

    /* ── Track list inside card ── */
    .pl-track-list {
      list-style: none; padding: 0; margin: 0;
      max-height: 80px; overflow-y: auto;
      margin-bottom: 8px;
    }
    .pl-track-list::-webkit-scrollbar { width: 3px; }
    .pl-track-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    .pl-track-item {
      padding: 3px 0;
      font-size: 11px;
      color: #64748b;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.15s;
    }
    .pl-track-item:hover { color: #a78bfa; }
    .pl-track-item.current { color: #7c3aed; font-weight: 700; }

    /* ── Card actions ── */
    .pl-card-actions { display: flex; gap: 8px; margin-top: auto; }
    .pl-action-play {
      flex: 1;
      padding: 8px;
      background: rgba(124,58,237,0.15);
      border: 1px solid rgba(124,58,237,0.3);
      border-radius: 9px;
      color: #a78bfa;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .pl-action-play:hover { background: rgba(124,58,237,0.3); color: #fff; }
    .pl-action-add {
      padding: 8px 12px;
      background: rgba(6,182,212,0.12);
      border: 1px solid rgba(6,182,212,0.25);
      border-radius: 9px;
      color: #06b6d4;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .pl-action-add:hover { background: rgba(6,182,212,0.25); color: #fff; }

    /* ── Player bar ── */
    .pl-player {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: rgba(14,14,20,0.97);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255,255,255,0.07);
      padding: 10px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      z-index: 1000;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.6);
    }
    .pl-player-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 180px;
      overflow: hidden;
    }
    .pl-player-cover {
      width: 46px; height: 46px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .pl-player-cover-placeholder {
      width: 46px; height: 46px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1e1030, #0f1a2e);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .pl-player-title {
      font-size: 13px; font-weight: 700; color: #f1f5f9;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      max-width: 140px;
    }
    .pl-player-pl {
      font-size: 11px; color: #64748b; margin-top: 2px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      max-width: 140px;
    }
    .pl-player-center {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      flex: 1; max-width: 500px;
    }
    .pl-player-controls { display: flex; align-items: center; gap: 20px; }
    .pl-ctrl {
      background: none; border: none;
      color: #94a3b8; font-size: 18px;
      cursor: pointer; padding: 0;
      transition: color 0.15s;
    }
    .pl-ctrl:hover:not(:disabled) { color: #f1f5f9; }
    .pl-ctrl:disabled { opacity: 0.3; cursor: default; }
    .pl-ctrl-main {
      width: 38px; height: 38px;
      background: #fff; border: none;
      border-radius: 50%;
      color: #0a0a0f; font-size: 16px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, background 0.15s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .pl-ctrl-main:hover { transform: scale(1.08); background: #e2e8f0; }
    .pl-progress-row {
      display: flex; align-items: center; gap: 10px; width: 100%;
    }
    .pl-time {
      font-size: 10px; color: #64748b;
      font-family: 'DM Mono', monospace;
      min-width: 32px;
    }
    .pl-progress {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      height: 4px;
      border-radius: 99px;
      background: rgba(255,255,255,0.1);
      outline: none;
      cursor: pointer;
    }
    .pl-progress::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #7c3aed;
      cursor: pointer;
      box-shadow: 0 0 0 2px rgba(124,58,237,0.3);
    }
    .pl-player-right {
      display: flex; align-items: center; gap: 10px;
      min-width: 140px; justify-content: flex-end;
    }
    .pl-vol-icon { font-size: 14px; color: #64748b; }
    .pl-volume {
      width: 72px;
      -webkit-appearance: none;
      appearance: none;
      height: 4px;
      border-radius: 99px;
      background: rgba(255,255,255,0.1);
      outline: none;
      cursor: pointer;
    }
    .pl-volume::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #06b6d4;
      cursor: pointer;
    }
    .pl-close {
      background: none; border: none;
      color: #64748b; font-size: 16px;
      cursor: pointer; padding: 4px;
      transition: color 0.15s;
    }
    .pl-close:hover { color: #f43f5e; }

    /* ── Overlay / Modal ── */
    .pl-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1010;
      animation: plFadeIn 0.15s ease;
    }
    @keyframes plFadeIn { from { opacity: 0; } to { opacity: 1; } }
    .pl-modal {
      background: #16161f;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      width: 440px;
      max-width: 95vw;
      max-height: 88vh;
      overflow-y: auto;
      box-shadow: 0 30px 80px rgba(0,0,0,0.7);
      display: flex; flex-direction: column;
      animation: plSlideUp 0.2s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes plSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pl-modal::-webkit-scrollbar { width: 4px; }
    .pl-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .pl-modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 24px 0;
    }
    .pl-modal-title {
      font-size: 17px; font-weight: 700; color: #f1f5f9;
    }
    .pl-modal-close {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #64748b; font-size: 14px;
      width: 30px; height: 30px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .pl-modal-close:hover { background: rgba(244,63,94,0.15); color: #f43f5e; }

    .pl-modal-section {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .pl-section-label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; color: #64748b;
      text-transform: uppercase; margin-bottom: 10px;
    }
    .pl-section-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 10px;
    }
    .pl-selected-badge {
      font-size: 11px; font-weight: 700;
      background: rgba(124,58,237,0.2); color: #a78bfa;
      padding: 2px 8px; border-radius: 99px;
    }

    /* ── Inputs ── */
    .pl-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 10px 14px;
      color: #f1f5f9;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      margin-bottom: 8px;
    }
    .pl-input:focus { border-color: rgba(124,58,237,0.5); }
    .pl-input::placeholder { color: #334155; }

    .pl-cover-row {
      display: flex; align-items: center; gap: 10px; margin-top: 2px;
    }
    .pl-cover-thumb {
      width: 44px; height: 44px;
      border-radius: 8px; object-fit: cover;
      border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;
    }
    .pl-cover-ph {
      width: 44px; height: 44px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }

    /* ── Track search in modal ── */
    .pl-search-wrap {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 10px;
      padding: 8px 12px;
      margin-bottom: 8px;
      transition: border-color 0.2s;
    }
    .pl-search-wrap:focus-within { border-color: rgba(124,58,237,0.4); }
    .pl-search-input {
      flex: 1; border: none; background: none;
      color: #f1f5f9; font-family: 'Outfit', sans-serif; font-size: 13px; outline: none;
    }
    .pl-search-input::placeholder { color: #334155; }
    .pl-clear-search {
      background: none; border: none; color: #64748b;
      font-size: 12px; cursor: pointer; padding: 0;
    }

    .pl-select-all-row { display: flex; gap: 12px; margin-bottom: 8px; }
    .pl-sel-all {
      font-size: 12px; font-weight: 600;
      color: #7c3aed; background: none; border: none;
      cursor: pointer; padding: 0; font-family: 'Outfit', sans-serif;
    }
    .pl-sel-clear {
      font-size: 12px; font-weight: 600;
      color: #f43f5e; background: none; border: none;
      cursor: pointer; padding: 0; font-family: 'Outfit', sans-serif;
    }

    /* ── Track picker list ── */
    .pl-picker-list {
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      overflow: hidden;
      max-height: 220px;
      overflow-y: auto;
    }
    .pl-picker-list::-webkit-scrollbar { width: 4px; }
    .pl-picker-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .pl-picker-row {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 14px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background 0.15s;
    }
    .pl-picker-row:last-child { border-bottom: none; }
    .pl-picker-row:hover { background: rgba(255,255,255,0.04); }
    .pl-picker-row.checked { background: rgba(124,58,237,0.1); }
    .pl-checkbox {
      width: 18px; height: 18px;
      border-radius: 5px;
      border: 2px solid rgba(255,255,255,0.15);
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .pl-checkbox.checked { background: #7c3aed; border-color: #7c3aed; }
    .pl-checkmark { color: #fff; font-size: 11px; font-weight: 700; line-height: 1; }
    .pl-picker-info { flex: 1; overflow: hidden; }
    .pl-picker-title {
      font-size: 13px; font-weight: 600; color: #f1f5f9;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      display: block;
    }
    .pl-picker-meta {
      font-size: 11px; color: #64748b; display: block; margin-top: 1px;
    }
    .pl-picker-ext {
      font-size: 10px; font-weight: 700; color: #334155;
      font-family: 'DM Mono', monospace;
    }
    .pl-picker-empty {
      font-size: 13px; color: #64748b;
      text-align: center; padding: 20px;
    }

    /* ── Modal footer ── */
    .pl-modal-actions {
      display: flex; justify-content: flex-end; gap: 10px;
      padding: 16px 24px;
    }
    .pl-cancel-btn {
      padding: 9px 18px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #94a3b8;
      font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }
    .pl-cancel-btn:hover { background: rgba(255,255,255,0.1); }
    .pl-submit-btn {
      padding: 9px 20px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 14px; font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 14px rgba(124,58,237,0.35);
    }
    .pl-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .pl-submit-btn:disabled { opacity: 0.5; cursor: default; }

    /* ── Add song select ── */
    .pl-select {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 10px 14px;
      color: #f1f5f9;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      margin: 12px 0;
    }
    .pl-select option { background: #16161f; color: #f1f5f9; }
  `;
  document.head.appendChild(s);
}

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

// ─── Component ────────────────────────────────────────────────────────────────
const Playlists = ({ mode, currentUserEmail }) => {
  const [playlists, setPlaylists]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [error, setError]                 = useState("");

  // Create modal
  const [showCreateModal, setShowCreateModal]     = useState(false);
  const [newTitle, setNewTitle]                   = useState("");
  const [newDescription, setNewDescription]       = useState("");
  const [newCover, setNewCover]                   = useState("");
  const [creating, setCreating]                   = useState(false);
  const [selectedTrackIds, setSelectedTrackIds]   = useState([]);
  const [trackSearch, setTrackSearch]             = useState("");

  // Add-song modal
  const [showSongModal, setShowSongModal]   = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [addingSong, setAddingSong]         = useState(false);

  // Player
  const [activePlaylist, setActivePlaylist]     = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [progress, setProgress]                 = useState(0);
  const [duration, setDuration]                 = useState(0);
  const [volume, setVolume]                     = useState(1);
  const audioRef = useRef(null);

  const isArtist = mode?.toLowerCase() === "artist";

  useEffect(() => { fetchPlaylists(); fetchAvailableSongs(); }, []);

  useEffect(() => {
    if (!activePlaylist) return;
    const track = activePlaylist.tracks[currentTrackIndex];
    if (!track || !audioRef.current) return;
    audioRef.current.src = `${API}/uploads/audio/${track.filename}`;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => { console.error("Playback error:", err); setIsPlaying(false); });
  }, [currentTrackIndex, activePlaylist]);

  const fetchPlaylists = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/add-playlists`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch { setError("Failed to load playlists. Please refresh."); }
    finally { setLoading(false); }
  };

  const fetchAvailableSongs = async () => {
    try {
      const res = await fetch(`${API}/songs`, { credentials: "include" });
      const data = await res.json();
      setAvailableSongs(data.songs || []);
    } catch {}
  };

  // ── Player handlers ──────────────────────────────────────────────
  const handlePlayPlaylist = (pl) => {
    if (!pl.tracks?.length) return alert("No songs in this playlist yet!");
    if (activePlaylist?._id === pl._id) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      return;
    }
    setActivePlaylist(pl); setCurrentTrackIndex(0); setProgress(0); setDuration(0);
  };
  const handlePrev = () => { if (currentTrackIndex > 0) setCurrentTrackIndex(i => i - 1); };
  const handleNext = () => {
    if (activePlaylist && currentTrackIndex < activePlaylist.tracks.length - 1)
      setCurrentTrackIndex(i => i + 1);
  };
  const handleTrackEnd = () => {
    if (activePlaylist && currentTrackIndex < activePlaylist.tracks.length - 1)
      setCurrentTrackIndex(i => i + 1);
    else { setIsPlaying(false); setProgress(0); }
  };
  const handleSeek  = (e) => { const v = parseFloat(e.target.value); audioRef.current && (audioRef.current.currentTime = v); setProgress(v); };
  const handleVolume = (e) => { const v = parseFloat(e.target.value); audioRef.current && (audioRef.current.volume = v); setVolume(v); };
  const closePlayer = () => { audioRef.current?.pause(); setActivePlaylist(null); setIsPlaying(false); setProgress(0); setDuration(0); };

  // ── Create playlist ──────────────────────────────────────────────
  const toggleTrack = (id) =>
    setSelectedTrackIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const handleCreatePlaylist = async () => {
    if (!newTitle.trim()) return alert("Title is required");
    setCreating(true);
    try {
      const res = await fetch(`${API}/create-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          coverUrl: newCover.trim() || `https://picsum.photos/seed/${Date.now()}/400/400`,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to create playlist"); return; }
      let created = data.playlist;
      for (const trackId of selectedTrackIds) {
        const r = await fetch(`${API}/add-track-to-playlist`, {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ playlistId: created._id, trackId }),
        });
        if (r.ok) { const d = await r.json(); created = d.playlist; }
      }
      setPlaylists(prev => [created, ...prev]);
      closeCreateModal();
    } catch { alert("Server error. Please try again."); }
    finally { setCreating(false); }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false); setNewTitle(""); setNewDescription(""); setNewCover("");
    setSelectedTrackIds([]); setTrackSearch("");
  };

  // ── Add song ─────────────────────────────────────────────────────
  const handleAddSong = async () => {
    if (!selectedSongId) return;
    setAddingSong(true);
    try {
      const res = await fetch(`${API}/add-track-to-playlist`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ playlistId: selectedPlaylist._id, trackId: selectedSongId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlaylists(prev => prev.map(pl => pl._id === selectedPlaylist._id ? data.playlist : pl));
        if (activePlaylist?._id === selectedPlaylist._id) setActivePlaylist(data.playlist);
        setShowSongModal(false); setSelectedSongId("");
      } else alert(data.message || "Failed to add song");
    } catch { alert("Server error."); }
    finally { setAddingSong(false); }
  };

  const songsNotInPlaylist = availableSongs.filter(
    s => !selectedPlaylist?.tracks?.some(t => (t._id ?? t) === s._id)
  );
  const currentTrack = activePlaylist?.tracks[currentTrackIndex];
  const filteredSongs = availableSongs.filter(s =>
    s.title.toLowerCase().includes(trackSearch.toLowerCase()) ||
    (s.artist || "").toLowerCase().includes(trackSearch.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="pl-root">
      <div className="pl-loading">
        <div className="pl-spin" />
        <span style={{ color: "#64748b", fontSize: "14px" }}>Loading playlists…</span>
      </div>
    </div>
  );

  return (
    <div className="pl-root">
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleTrackEnd}
      />

      {/* Header */}
      <div className="pl-header">
        <div style={{ position: "relative" }}>
          <div className="pl-title">🎧 Playlists</div>
          <div className="pl-subtitle">{playlists.length} playlist{playlists.length !== 1 ? "s" : ""}</div>
        </div>
        {isArtist && (
          <button className="pl-new-btn" onClick={() => setShowCreateModal(true)}>
            <span>＋</span> New Playlist
          </button>
        )}
      </div>

      <div className="pl-body">
        {/* Error */}
        {error && (
          <div className="pl-error">
            ⚠️ {error}
            <button className="pl-retry-btn" onClick={fetchPlaylists}>Retry</button>
          </div>
        )}

        {/* Empty */}
        {!error && playlists.length === 0 && (
          <div className="pl-empty">
            <div className="pl-empty-icon">🎵</div>
            <p className="pl-empty-text">
              {isArtist ? "No playlists yet. Create your first one!" : "No playlists available yet."}
            </p>
          </div>
        )}

        {/* Grid */}
        {playlists.length > 0 && (
          <div className="pl-grid">
            {playlists.map((pl, i) => {
              const isActive = activePlaylist?._id === pl._id;
              return (
                <div
                  key={pl._id}
                  className={`pl-card${isActive ? " active" : ""}`}
                  style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s` }}
                >
                  {/* Cover */}
                  <div className="pl-card-cover">
                    {pl.coverUrl
                      ? <img src={pl.coverUrl} alt={pl.title} onError={e => { e.target.src = `https://picsum.photos/seed/${pl._id}/400/400`; }} />
                      : <div className="pl-cover-placeholder">🎧</div>
                    }
                    {isActive && <div className="pl-now-badge">▶ Now Playing</div>}
                    <div className="pl-cover-overlay">
                      <button className="pl-play-big" onClick={() => handlePlayPlaylist(pl)}>
                        {isActive && isPlaying ? "⏸" : "▶"}
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pl-card-body">
                    <div className="pl-card-title">{pl.title}</div>
                    {pl.description && <div className="pl-card-desc">{pl.description}</div>}
                    <div className="pl-card-count">{pl.tracks?.length || 0} tracks</div>

                    {pl.tracks?.length > 0 && (
                      <ul className="pl-track-list">
                        {pl.tracks.map((track, idx) => (
                          <li
                            key={track._id}
                            className={`pl-track-item${isActive && currentTrackIndex === idx ? " current" : ""}`}
                            onClick={() => { setActivePlaylist(pl); setCurrentTrackIndex(idx); }}
                          >
                            {isActive && currentTrackIndex === idx && isPlaying ? "🎵 " : ""}
                            {track.title}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="pl-card-actions">
                      <button className="pl-action-play" onClick={() => handlePlayPlaylist(pl)}>
                        {isActive && isPlaying ? "⏸ Pause" : "▶ Play"}
                      </button>
                      {isArtist && (
                        <button
                          className="pl-action-add"
                          onClick={() => { setSelectedPlaylist(pl); setSelectedSongId(""); setShowSongModal(true); }}
                        >
                          ＋
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Player bar ── */}
      {activePlaylist && (
        <div className="pl-player">
          <div className="pl-player-left">
            {activePlaylist.coverUrl
              ? <img src={activePlaylist.coverUrl} alt="cover" className="pl-player-cover" onError={e => { e.target.style.display = "none"; }} />
              : <div className="pl-player-cover-placeholder">🎧</div>
            }
            <div style={{ overflow: "hidden" }}>
              <div className="pl-player-title">{currentTrack?.title || "Unknown Track"}</div>
              <div className="pl-player-pl">{activePlaylist.title}</div>
            </div>
          </div>

          <div className="pl-player-center">
            <div className="pl-player-controls">
              <button className="pl-ctrl" onClick={handlePrev} disabled={currentTrackIndex === 0}>⏮</button>
              <button className="pl-ctrl-main" onClick={() => {
                if (!audioRef.current) return;
                if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                else audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
              }}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="pl-ctrl" onClick={handleNext} disabled={currentTrackIndex === activePlaylist.tracks.length - 1}>⏭</button>
            </div>
            <div className="pl-progress-row">
              <span className="pl-time">{fmt(progress)}</span>
              <input type="range" min={0} max={duration || 0} value={progress} onChange={handleSeek} className="pl-progress" />
              <span className="pl-time" style={{ textAlign: "right" }}>{fmt(duration)}</span>
            </div>
          </div>

          <div className="pl-player-right">
            <span className="pl-vol-icon">🔊</span>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume} className="pl-volume" />
            <button className="pl-close" onClick={closePlayer}>✕</button>
          </div>
        </div>
      )}

      {/* ── Create Playlist Modal ── */}
      {showCreateModal && (
        <div className="pl-overlay">
          <div className="pl-modal">
            <div className="pl-modal-header">
              <span className="pl-modal-title">🎶 Create Playlist</span>
              <button className="pl-modal-close" onClick={closeCreateModal}>✕</button>
            </div>

            <div className="pl-modal-section">
              <div className="pl-section-label">Details</div>
              <input className="pl-input" placeholder="Playlist Title *" value={newTitle} onChange={e => setNewTitle(e.target.value)} maxLength={80} autoFocus />
              <input className="pl-input" placeholder="Description (optional)" value={newDescription} onChange={e => setNewDescription(e.target.value)} maxLength={200} />
              <div className="pl-cover-row">
                <input
                  className="pl-input"
                  style={{ flex: 1, marginBottom: 0 }}
                  placeholder="Cover image URL (optional)"
                  value={newCover}
                  onChange={e => setNewCover(e.target.value)}
                />
                {newCover
                  ? <img src={newCover} alt="preview" className="pl-cover-thumb" onError={e => { e.target.style.display = "none"; }} />
                  : <div className="pl-cover-ph">🖼️</div>
                }
              </div>
            </div>

            <div className="pl-modal-section">
              <div className="pl-section-row">
                <div className="pl-section-label" style={{ margin: 0 }}>Add Tracks</div>
                {selectedTrackIds.length > 0 && (
                  <span className="pl-selected-badge">{selectedTrackIds.length} selected</span>
                )}
              </div>
              {availableSongs.length === 0 ? (
                <p className="pl-picker-empty">No tracks available yet.</p>
              ) : (
                <>
                  <div className="pl-search-wrap">
                    <span style={{ fontSize: "13px", color: "#64748b" }}>🔍</span>
                    <input
                      className="pl-search-input"
                      placeholder="Search tracks…"
                      value={trackSearch}
                      onChange={e => setTrackSearch(e.target.value)}
                    />
                    {trackSearch && <button className="pl-clear-search" onClick={() => setTrackSearch("")}>✕</button>}
                  </div>
                  <div className="pl-select-all-row">
                    <button className="pl-sel-all" onClick={() => setSelectedTrackIds(filteredSongs.map(s => s._id))}>Select all</button>
                    {selectedTrackIds.length > 0 && (
                      <button className="pl-sel-clear" onClick={() => setSelectedTrackIds([])}>Clear</button>
                    )}
                  </div>
                  <div className="pl-picker-list">
                    {filteredSongs.length === 0
                      ? <p className="pl-picker-empty">No tracks match your search.</p>
                      : filteredSongs.map(song => {
                          const checked = selectedTrackIds.includes(song._id);
                          return (
                            <div
                              key={song._id}
                              className={`pl-picker-row${checked ? " checked" : ""}`}
                              onClick={() => toggleTrack(song._id)}
                            >
                              <div className={`pl-checkbox${checked ? " checked" : ""}`}>
                                {checked && <span className="pl-checkmark">✓</span>}
                              </div>
                              <div className="pl-picker-info">
                                <span className="pl-picker-title">{song.title}</span>
                                <span className="pl-picker-meta">
                                  {song.artist || "Unknown"}{song.genre ? ` · ${song.genre}` : ""}
                                </span>
                              </div>
                              <span className="pl-picker-ext">
                                {song.originalName?.split(".").pop()?.toUpperCase() || "MP3"}
                              </span>
                            </div>
                          );
                        })
                    }
                  </div>
                </>
              )}
            </div>

            <div className="pl-modal-actions">
              <button className="pl-cancel-btn" onClick={closeCreateModal} disabled={creating}>Cancel</button>
              <button className="pl-submit-btn" onClick={handleCreatePlaylist} disabled={creating}>
                {creating ? "Creating…" : selectedTrackIds.length > 0
                  ? `Create with ${selectedTrackIds.length} track${selectedTrackIds.length > 1 ? "s" : ""}`
                  : "Create Playlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Song Modal ── */}
      {showSongModal && selectedPlaylist && (
        <div className="pl-overlay">
          <div className="pl-modal">
            <div className="pl-modal-header">
              <span className="pl-modal-title">🎵 Add to "{selectedPlaylist.title}"</span>
              <button className="pl-modal-close" onClick={() => setShowSongModal(false)}>✕</button>
            </div>
            <div className="pl-modal-section">
              {songsNotInPlaylist.length === 0
                ? <p className="pl-picker-empty">All available songs are already in this playlist.</p>
                : (
                  <select className="pl-select" value={selectedSongId} onChange={e => setSelectedSongId(e.target.value)}>
                    <option value="">— Select a track —</option>
                    {songsNotInPlaylist.map(s => (
                      <option key={s._id} value={s._id}>{s.title} · {s.artist || "Unknown"}</option>
                    ))}
                  </select>
                )
              }
            </div>
            <div className="pl-modal-actions">
              <button className="pl-cancel-btn" onClick={() => setShowSongModal(false)} disabled={addingSong}>Cancel</button>
              <button
                className="pl-submit-btn"
                onClick={handleAddSong}
                disabled={addingSong || !selectedSongId || songsNotInPlaylist.length === 0}
              >
                {addingSong ? "Adding…" : "Add Song"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;