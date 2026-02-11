import React, { useState, useRef } from 'react';
import { Upload, Music, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function MusicUploader() {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
    explicit: false,
    platforms: {
      spotify: true,
      amazonMusic: true,
      appleMusic: false,
      youtubeMusic: false
    }
  });

  const [audioFile, setAudioFile] = useState(null);
  const [coverArt, setCoverArt] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlatformChange = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverArt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile) {
      alert('Please select an audio file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const data = new FormData();
    data.append('audio', audioFile);
    if (coverArt) data.append('cover', coverArt);
    data.append('metadata', JSON.stringify(formData));

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: data
      });

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      const result = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setUploadStatus('success');
        setTimeout(() => {
          setFormData({
            title: '',
            artist: '',
            album: '',
            genre: '',
            releaseDate: '',
            explicit: false,
            platforms: {
              spotify: true,
              amazonMusic: true,
              appleMusic: false,
              youtubeMusic: false
            }
          });
          setAudioFile(null);
          setCoverArt(null);
          setCoverPreview(null);
          setUploadProgress(0);
          setUploadStatus(null);
        }, 3000);
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        body {
          font-family: 'Urbanist', sans-serif;
          background: linear-gradient(135deg, #0f0b1f 0%, #2d1b4e 50%, #0f0b1f 100%);
          min-height: 100vh;
        }
        
        .mono {
          font-family: 'Space Mono', monospace;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .upload-zone {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .upload-zone:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
        }
        
        .platform-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .platform-card:hover {
          transform: scale(1.02);
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 0.25rem rgba(139, 92, 246, 0.25);
        }
        
        .card-custom {
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .gradient-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
        }
        
        .gradient-button {
          background: linear-gradient(90deg, #7c3aed 0%, #c026d3 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .gradient-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%);
          transform: scale(1.02);
        }
        
        .gradient-button:disabled {
          background: linear-gradient(90deg, #475569 0%, #475569 100%);
        }
        
        .border-dashed-custom {
          border: 2px dashed rgba(139, 92, 246, 0.3);
          background: rgba(30, 41, 59, 0.3);
        }
        
        .border-dashed-custom:hover {
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(30, 41, 59, 0.5);
        }
        
        .text-violet-light {
          color: #c4b5fd;
        }
        
        .text-violet {
          color: #a78bfa;
        }
        
        .text-violet-dark {
          color: #8b5cf6;
        }
        
        .bg-platform-spotify {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
        }
        
        .bg-platform-amazon {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        }
        
        .bg-platform-apple {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        }
        
        .bg-platform-youtube {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
        }
        
        .platform-card-selected {
          border: 2px solid #8b5cf6 !important;
        }
        
        .platform-card-unselected {
          border: 2px solid rgba(139, 92, 246, 0.2) !important;
          background: rgba(30, 41, 59, 0.3) !important;
        }
      `}</style>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8 animate-slide-in">
            {/* Header */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="gradient-icon rounded-3 d-flex align-items-center justify-content-center" 
                     style={{width: '48px', height: '48px'}}>
                  <Music className="text-white" size={24} />
                </div>
                <h1 className="display-4 fw-bold text-white mb-0">
                  Upload Your Track
                </h1>
              </div>
              <p className="text-violet-light fs-5 ms-5 ps-3">
                Distribute your music to streaming platforms worldwide
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Audio File Upload */}
              <div className="card card-custom rounded-4 mb-4">
                <div className="card-body p-4">
                  <label className="form-label text-white fw-semibold fs-5 mb-3">
                    Audio File <span className="text-violet">*</span>
                  </label>
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    className="upload-zone border-dashed-custom rounded-3 p-5"
                  >
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioChange}
                      className="d-none"
                    />
                    {audioFile ? (
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center"
                               style={{width: '48px', height: '48px', background: '#8b5cf6'}}>
                            <Music className="text-white" size={24} />
                          </div>
                          <div>
                            <p className="text-white fw-medium mb-0">{audioFile.name}</p>
                            <p className="text-violet-light small mono mb-0">{formatFileSize(audioFile.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAudioFile(null);
                          }}
                          className="btn btn-link text-violet p-0"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="text-violet mx-auto mb-3" size={48} />
                        <p className="text-white fw-medium mb-1">Drop your audio file here</p>
                        <p className="text-violet-light small mb-0">or click to browse (WAV, MP3, FLAC)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Art Upload */}
              <div className="card card-custom rounded-4 mb-4">
                <div className="card-body p-4">
                  <label className="form-label text-white fw-semibold fs-5 mb-3">
                    Cover Art
                  </label>
                  <div className="d-flex gap-4 flex-wrap">
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className="upload-zone border-dashed-custom rounded-3 d-flex align-items-center justify-content-center overflow-hidden"
                      style={{width: '160px', height: '160px'}}
                    >
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="d-none"
                      />
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover preview" className="w-100 h-100" style={{objectFit: 'cover'}} />
                      ) : (
                        <div className="text-center p-3">
                          <Upload className="text-violet mx-auto mb-2" size={32} />
                          <p className="text-violet-light small mb-0">Upload cover</p>
                        </div>
                      )}
                    </div>
                    {coverArt && (
                      <div className="d-flex align-items-center">
                        <div>
                          <p className="text-white fw-medium mb-1">{coverArt.name}</p>
                          <p className="text-violet-light small mono mb-2">{formatFileSize(coverArt.size)}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCoverArt(null);
                              setCoverPreview(null);
                            }}
                            className="btn btn-link text-violet p-0 small"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Track Details */}
              <div className="card card-custom rounded-4 mb-4">
                <div className="card-body p-4">
                  <h2 className="text-white fw-semibold mb-4 fs-4">Track Details</h2>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-violet-light fw-medium">
                        Track Title <span className="text-violet">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter track title"
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-violet-light fw-medium">
                        Artist Name <span className="text-violet">*</span>
                      </label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter artist name"
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-violet-light fw-medium">Album</label>
                      <input
                        type="text"
                        name="album"
                        value={formData.album}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter album name"
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-violet-light fw-medium">Genre</label>
                      <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: 'white'
                        }}
                      >
                        <option value="">Select genre</option>
                        <option value="pop">Pop</option>
                        <option value="rock">Rock</option>
                        <option value="hiphop">Hip Hop</option>
                        <option value="electronic">Electronic</option>
                        <option value="jazz">Jazz</option>
                        <option value="classical">Classical</option>
                        <option value="country">Country</option>
                        <option value="rnb">R&B</option>
                        <option value="indie">Indie</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-violet-light fw-medium">Release Date</label>
                      <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="explicit"
                          checked={formData.explicit}
                          onChange={handleInputChange}
                          className="form-check-input"
                          id="explicitCheck"
                          style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderColor: 'rgba(139, 92, 246, 0.3)'
                          }}
                        />
                        <label className="form-check-label text-violet-light fw-medium" htmlFor="explicitCheck">
                          Explicit Content
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="card card-custom rounded-4 mb-4">
                <div className="card-body p-4">
                  <h2 className="text-white fw-semibold mb-4 fs-4">Distribution Platforms</h2>
                  <div className="row g-3">
                    {[
                      { key: 'spotify', name: 'Spotify', colorClass: 'bg-platform-spotify' },
                      { key: 'amazonMusic', name: 'Amazon Music', colorClass: 'bg-platform-amazon' },
                      { key: 'appleMusic', name: 'Apple Music', colorClass: 'bg-platform-apple' },
                      { key: 'youtubeMusic', name: 'YouTube Music', colorClass: 'bg-platform-youtube' }
                    ].map(platform => (
                      <div key={platform.key} className="col-6 col-lg-3">
                        <div
                          onClick={() => handlePlatformChange(platform.key)}
                          className={`platform-card p-3 rounded-3 ${
                            formData.platforms[platform.key]
                              ? `platform-card-selected ${platform.colorClass}`
                              : 'platform-card-unselected'
                          }`}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="text-white fw-semibold small">{platform.name}</span>
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: '20px',
                                height: '20px',
                                border: `2px solid ${formData.platforms[platform.key] ? 'white' : 'rgba(139, 92, 246, 0.5)'}`,
                                background: formData.platforms[platform.key] ? 'white' : 'transparent'
                              }}
                            >
                              {formData.platforms[platform.key] && (
                                <CheckCircle size={16} style={{color: '#0f172a'}} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="card card-custom rounded-4 mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <Loader className="text-violet" size={20} style={{animation: 'spin 1s linear infinite'}} />
                      <span className="text-white fw-medium">Uploading your track...</span>
                    </div>
                    <div className="progress" style={{height: '12px', background: '#1e293b'}}>
                      <div
                        className="progress-bar shimmer"
                        role="progressbar"
                        style={{
                          width: `${uploadProgress}%`,
                          background: 'linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)'
                        }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                    <p className="text-violet-light small mono mt-2 mb-0">{uploadProgress}% complete</p>
                  </div>
                </div>
              )}

              {/* Upload Status */}
              {uploadStatus === 'success' && (
                <div className="alert alert-success d-flex align-items-center gap-3 rounded-4 mb-4" 
                     style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                  <CheckCircle className="text-success" size={32} />
                  <div>
                    <h5 className="alert-heading text-white mb-1">Upload Successful!</h5>
                    <p className="mb-0" style={{color: '#86efac'}}>Your track has been submitted for distribution.</p>
                  </div>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="alert alert-danger d-flex align-items-center gap-3 rounded-4 mb-4"
                     style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                  <AlertCircle className="text-danger" size={32} />
                  <div>
                    <h5 className="alert-heading text-white mb-1">Upload Failed</h5>
                    <p className="mb-0" style={{color: '#fca5a5'}}>There was an error uploading your track. Please try again.</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || !audioFile}
                className="btn btn-lg w-100 text-white fw-bold py-3 rounded-3 shadow-lg gradient-button"
              >
                {uploading ? 'Uploading...' : 'Upload & Distribute'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 text-center small" style={{color: 'rgba(196, 181, 253, 0.6)'}}>
              <p className="mb-0">By uploading, you confirm you own all rights to this content</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}