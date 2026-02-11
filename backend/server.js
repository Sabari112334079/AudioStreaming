const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-upload';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Track Schema
const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  releaseDate: {
    type: String
  },
  explicit: {
    type: Boolean,
    default: false
  },
  platforms: {
    spotify: { type: Boolean, default: false },
    appleMusic: { type: Boolean, default: false },
    youtube: { type: Boolean, default: false },
    soundcloud: { type: Boolean, default: false },
    tidal: { type: Boolean, default: false },
    amazonMusic: { type: Boolean, default: false }
  },
  audioFile: {
    filename: String,
    originalName: String,
    size: Number,
    mimetype: String,
    path: String,
    url: String
  },
  coverFile: {
    filename: String,
    originalName: String,
    size: Number,
    mimetype: String,
    path: String,
    url: String
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Track = mongoose.model('Track', trackSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const audioDir = path.join(uploadsDir, 'audio');
const coverDir = path.join(uploadsDir, 'covers');

[uploadsDir, audioDir, coverDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'audio') {
      cb(null, audioDir);
    } else if (file.fieldname === 'cover') {
      cb(null, coverDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed for the audio field'), false);
    }
  } else if (file.fieldname === 'cover') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for the cover field'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Upload endpoint
app.post('/api/upload', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    // Parse metadata
    const metadata = JSON.parse(req.body.metadata);

    // Validate required fields
    if (!metadata.title || !metadata.artist) {
      // Clean up uploaded files if validation fails
      if (req.files?.audio) fs.unlinkSync(req.files.audio[0].path);
      if (req.files?.cover) fs.unlinkSync(req.files.cover[0].path);
      
      return res.status(400).json({
        success: false,
        message: 'Title and artist are required fields'
      });
    }

    // Check if audio file was uploaded
    if (!req.files || !req.files.audio) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    // Get file information
    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover ? req.files.cover[0] : null;

    // Create track record
    const trackData = {
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album || '',
      genre: metadata.genre || '',
      releaseDate: metadata.releaseDate || '',
      explicit: metadata.explicit || false,
      platforms: metadata.platforms || {},
      audioFile: {
        filename: audioFile.filename,
        originalName: audioFile.originalname,
        size: audioFile.size,
        mimetype: audioFile.mimetype,
        path: audioFile.path,
        url: `/uploads/audio/${audioFile.filename}`
      },
      coverFile: coverFile ? {
        filename: coverFile.filename,
        originalName: coverFile.originalname,
        size: coverFile.size,
        mimetype: coverFile.mimetype,
        path: coverFile.path,
        url: `/uploads/covers/${coverFile.filename}`
      } : null,
      status: 'processing'
    };

    // Save to MongoDB
    const track = new Track(trackData);
    await track.save();

    // Simulate processing (in production, trigger actual distribution logic)
    console.log('✅ Track uploaded:', trackData.title, 'by', trackData.artist);
    console.log('📀 Track ID:', track._id);
    console.log('🎵 Audio file:', audioFile.filename);
    console.log('🌐 Distribution platforms:', Object.keys(metadata.platforms).filter(p => metadata.platforms[p]));

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Track uploaded successfully',
      data: {
        trackId: track._id,
        title: track.title,
        artist: track.artist,
        audioUrl: track.audioFile.url,
        coverUrl: track.coverFile?.url,
        platforms: Object.keys(metadata.platforms).filter(p => metadata.platforms[p])
      }
    });

  } catch (error) {
    // Clean up uploaded files on error
    if (req.files?.audio) {
      try {
        fs.unlinkSync(req.files.audio[0].path);
      } catch (e) {
        console.error('Error deleting audio file:', e);
      }
    }
    if (req.files?.cover) {
      try {
        fs.unlinkSync(req.files.cover[0].path);
      } catch (e) {
        console.error('Error deleting cover file:', e);
      }
    }

    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading track',
      error: error.message
    });
  }
});

// Get all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ uploadedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tracks.length,
      tracks: tracks
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tracks',
      error: error.message
    });
  }
});

// Get specific track by ID
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (track) {
      res.status(200).json({
        success: true,
        track: track
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching track',
      error: error.message
    });
  }
});

// Update track status
app.patch('/api/tracks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['processing', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const track = await Track.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (track) {
      res.status(200).json({
        success: true,
        message: 'Track status updated',
        track: track
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating track',
      error: error.message
    });
  }
});

// Delete track
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    // Delete files from storage
    if (track.audioFile && fs.existsSync(track.audioFile.path)) {
      fs.unlinkSync(track.audioFile.path);
    }
    if (track.coverFile && fs.existsSync(track.coverFile.path)) {
      fs.unlinkSync(track.coverFile.path);
    }

    // Delete from database
    await Track.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Track deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting track',
      error: error.message
    });
  }
});

// Serve uploaded files
app.use('/uploads/audio', express.static(audioDir));
app.use('/uploads/covers', express.static(coverDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Music upload server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 100MB.'
      });
    }
  }
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start server ONLY after MongoDB connects
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`🎵 Music Upload Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log(`🎧 Audio files: ${audioDir}`);
    console.log(`🎨 Cover art: ${coverDir}`);
    console.log(`🗄️  MongoDB: ${MONGODB_URI}`);
  });
});


module.exports = app;