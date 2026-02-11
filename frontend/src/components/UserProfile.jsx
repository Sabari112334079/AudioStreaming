import { useState } from "react";
import { Heart, Music, Edit2, Share2, Settings } from "lucide-react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("playlists");

  const user = {
    name: "Alex Rivera",
    username: "@alexrivera",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200",
    bio: "Music enthusiast | Indie & Electronic lover | Always discovering new sounds",
    followers: 1247,
    following: 892,
    totalListeningHours: 342,
    joinedDate: "January 2023",
  };

  const playlists = [
    { id: 1, name: "Late Night Vibes", tracks: 42, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300", isPublic: true },
    { id: 2, name: "Workout Mix", tracks: 38, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300", isPublic: true },
    { id: 3, name: "Focus Flow", tracks: 56, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300", isPublic: false },
    { id: 4, name: "Road Trip Anthems", tracks: 67, image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300", isPublic: true },
  ];

  return (
    <div className="bg-black text-white">

      {/* COVER */}
      <div
        className="profile-cover"
        style={{ backgroundImage: `url(${user.coverImage})` }}
      ></div>

      {/* PROFILE HEADER */}
      <div className="container">
        <div className="row align-items-end" style={{ marginTop: "-80px" }}>

          <div className="col-md-auto text-center">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
          </div>

          <div className="col-md">
            <h2 className="fw-bold mt-3 mt-md-0">{user.name}</h2>
            <p className="text-secondary mb-1">{user.username}</p>
            <p className="text-muted">{user.bio}</p>

            <div className="d-flex gap-4 small">
              <div><b>{user.followers}</b> Followers</div>
              <div><b>{user.following}</b> Following</div>
              <div><b>{user.totalListeningHours}</b> Hours Listened</div>
            </div>
          </div>

          <div className="col-md-auto mt-3 mt-md-0">
            <div className="d-flex gap-2">
              <button className="btn btn-primary rounded-pill">
                <Edit2 size={16} className="me-1"/> Edit
              </button>

              <button className="btn btn-outline-light rounded-circle">
                <Share2 size={18}/>
              </button>

              <button className="btn btn-outline-light rounded-circle">
                <Settings size={18}/>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* TABS */}
      <div className="border-bottom border-secondary mt-4 sticky-top bg-black">
        <div className="container">
          <ul className="nav nav-tabs border-0">
            {["playlists", "recent", "top artists", "liked"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link text-capitalize ${
                    activeTab === tab
                      ? "active bg-black text-white border-primary"
                      : "text-secondary"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container py-5">

        {/* PLAYLISTS */}
        {activeTab === "playlists" && (
          <>
            <div className="d-flex justify-content-between mb-4">
              <h3>My Playlists</h3>
              <button className="btn btn-primary">Create Playlist</button>
            </div>

            <div className="row g-4">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="col-12 col-sm-6 col-lg-3">
                  <div className="playlist-card">
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="img-fluid rounded mb-3"
                    />
                    <h5>{playlist.name}</h5>
                    <small className="text-secondary">
                      {playlist.tracks} tracks • {playlist.isPublic ? "Public" : "Private"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* RECENT TRACKS */}
        {activeTab === "recent" && (
          <>
            <h3 className="mb-4">Recently Played</h3>

            {[1,2,3].map((i)=>(
              <div key={i} className="track-row d-flex align-items-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1619983081563-430f63602796?w=100"
                  className="rounded me-3"
                  width="60"
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold">Midnight City</div>
                  <small className="text-secondary">M83 • Hurry Up, We're Dreaming</small>
                </div>
                <small className="text-secondary me-3">4:04</small>
                <Heart size={20}/>
              </div>
            ))}
          </>
        )}

        {/* TOP ARTISTS */}
        {activeTab === "top artists" && (
          <>
            <h3 className="mb-4">Top Artists</h3>

            <div className="row g-4 text-center">
              {["Tame Impala","Radiohead","The Weeknd","Flume"].map((name,i)=>(
                <div className="col-6 col-md-3" key={i}>
                  <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200"
                    className="artist-avatar img-fluid mb-2"
                  />
                  <h6>{name}</h6>
                  <small className="text-secondary">200+ plays</small>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LIKED SONGS */}
        {activeTab === "liked" && (
          <>
            <div className="bg-primary rounded p-5 mb-4">
              <Heart size={40} className="mb-3"/>
              <h2>Liked Songs</h2>
              <p>234 songs</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
