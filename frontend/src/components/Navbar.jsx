import { useState } from "react";
import { Music, User, Mic2, Upload, Search, Bell, Settings } from "lucide-react";

export default function Navbar({ currentView, setCurrentView }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top border-bottom border-secondary">
      <div className="container">

        {/* Logo */}
        <div
          className="d-flex align-items-center gap-2 cursor-pointer"
          onClick={() => setCurrentView("user")}
          style={{ cursor: "pointer" }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            }}
          >
            <Music color="white" size={22} />
          </div>
          <span className="navbar-brand mb-0 h5 ms-2 d-none d-sm-block">
            SoundWave
          </span>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMobileMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Content */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
          
          {/* LEFT SIDE */}
          <div className="navbar-nav ms-auto align-items-md-center gap-md-3">

            {/* USER VIEW */}
            {currentView === "user" && (
              <>
                {/* Search */}
                <div className="position-relative me-md-3 my-2 my-md-0">
                  <Search
                    size={16}
                    className="position-absolute"
                    style={{
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#aaa",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search songs, artists, albums..."
                    style={{ minWidth: "250px" }}
                  />
                </div>

                <button
                  className="btn btn-outline-light"
                  onClick={() => setCurrentView("artist")}
                >
                  <Mic2 size={18} className="me-2" />
                  Artist
                </button>
              </>
            )}

            {/* ARTIST VIEW */}
            {currentView === "artist" && (
              <>
                <button
                  className="btn btn-outline-light"
                  onClick={() => setCurrentView("user")}
                >
                  <User size={18} className="me-2" />
                  User View
                </button>

                <button
                  className="btn text-white"
                  style={{
                    background:
                      "linear-gradient(90deg,#7c3aed,#4f46e5)",
                    borderRadius: "50px",
                  }}
                  onClick={() => setCurrentView("upload")}
                >
                  <Upload size={18} className="me-2" />
                  Upload Track
                </button>
              </>
            )}

            {/* UPLOAD VIEW */}
            {currentView === "upload" && (
              <>
                <button
                  className="btn btn-outline-light"
                  onClick={() => setCurrentView("user")}
                >
                  <User size={18} className="me-2" />
                  User View
                </button>

                <button
                  className="btn btn-outline-light"
                  onClick={() => setCurrentView("artist")}
                >
                  <Mic2 size={18} className="me-2" />
                  Artist Profile
                </button>
              </>
            )}

            {/* Right Icons */}
            <div className="d-flex align-items-center gap-2 ms-md-3 mt-3 mt-md-0">
              <button className="btn btn-outline-secondary">
                <Bell size={18} />
              </button>

              <button className="btn btn-outline-secondary">
                <Settings size={18} />
              </button>

              {/* Avatar */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  cursor: "pointer",
                }}
              >
                <User size={16} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
