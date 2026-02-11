import { useState } from "react";
import {
  Play,
  Heart,
  Share2,
  MoreHorizontal,
  Users,
  Music,
  Award,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function ArtistProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const artist = {
    name: "Luna Rivers",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200",
    bio: "Luna Rivers is an indie-electronic artist known for atmospheric soundscapes and introspective lyrics.",
    monthlyListeners: 2847329,
    followers: 1245678,
    genres: ["Indie Electronic", "Dream Pop", "Ambient"],
    location: "Los Angeles, CA",
  };

  const stats = [
    { label: "Monthly Listeners", value: artist.monthlyListeners.toLocaleString(), icon: Users },
    { label: "Followers", value: artist.followers.toLocaleString(), icon: Heart },
    { label: "Total Albums", value: "4", icon: Music },
    { label: "Awards", value: "7", icon: Award },
  ];

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <div
        className="position-relative"
        style={{
          backgroundImage: `url(${artist.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "420px",
        }}
      >
        <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100"></div>

        <div className="container position-relative h-100 d-flex flex-column justify-content-end pb-4">
          {artist.verified && (
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary rounded-circle p-2">
                <Award size={14} />
              </span>
              <small className="text-info fw-semibold">Verified Artist</small>
            </div>
          )}

          <h1 className="display-3 fw-bold">{artist.name}</h1>

          <p className="text-muted-light">
            {artist.monthlyListeners.toLocaleString()} monthly listeners •{" "}
            {artist.genres.join(", ")}
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="bg-darker py-4 border-bottom border-secondary">
        <div className="container d-flex flex-wrap align-items-center gap-3">

          <div className="play-btn">
            <Play size={26} fill="white" />
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`btn ${
              isFollowing ? "btn-secondary" : "btn-outline-light"
            } rounded-pill px-4`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>

          <button className="btn btn-outline-light rounded-circle">
            <Share2 size={20} />
          </button>

          <button className="btn btn-outline-light rounded-circle">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="container py-5">
        <div className="row g-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="col-6 col-md-3">
                <div className="bg-card text-center p-4 rounded">
                  <Icon className="mb-2 text-info" size={30} />
                  <h4 className="fw-bold">{stat.value}</h4>
                  <small className="text-muted">{stat.label}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <div className="border-bottom border-secondary sticky-top bg-black">
        <div className="container">
          <ul className="nav nav-tabs border-0">
            {["overview", "discography", "tour", "about"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link text-capitalize ${
                    activeTab === tab ? "active bg-black text-white border-primary" : "text-secondary"
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

      {/* OVERVIEW CONTENT */}
      {activeTab === "overview" && (
        <div className="container py-5">

          <h3 className="mb-4">About {artist.name}</h3>

          <div className="bg-card p-4 rounded mb-4">
            <p className="text-muted-light">{artist.bio}</p>

            <div className="row mt-4">
              <div className="col-md-6">
                <h6 className="text-secondary">Genres</h6>
                {artist.genres.map((g, i) => (
                  <span key={i} className="badge bg-secondary me-2 mb-2">
                    {g}
                  </span>
                ))}
              </div>

              <div className="col-md-6">
                <h6 className="text-secondary">Based In</h6>
                <p className="fw-semibold">{artist.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOUR */}
      {activeTab === "tour" && (
        <div className="container py-5">
          <h3 className="mb-4">Upcoming Shows</h3>

          <div className="bg-card p-4 rounded d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3">
              <Calendar size={24} className="text-info" />
              <div>
                <h5 className="mb-0">The Wiltern</h5>
                <small className="text-muted">Los Angeles, CA — Mar 15, 2026</small>
              </div>
            </div>

            <button className="btn btn-primary rounded-pill">
              Get Tickets <ExternalLink size={16} className="ms-1"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
