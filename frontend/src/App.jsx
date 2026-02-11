import { useState } from 'react';
import Navbar from './components/Navbar';
import MusicUploader from './components/Musicuploader';
import ArtistProfile from './components/ArtistProfile';
import UserProfile from './components/UserProfile';
import HomePage from './components/HomePage';
function App() {
  const [currentView, setCurrentView] = useState(''); // 'user', 'artist', 'upload'

  const renderView = () => {
    switch (currentView) {
      case 'user':
        return <UserProfile />;
      case 'artist':
        return <ArtistProfile />;
      case 'upload':
        return <MusicUploader />;
    
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      {renderView()}
    </div>
  );
}

export default App;