import { useState } from 'react';
import Navbar from './components/Navbar';
import MusicUploader from './components/Musicuploader';
import ArtistProfile from './components/ArtistProfile';
import UserProfile from './components/UserProfile';

function App() {
  const [currentView, setCurrentView] = useState('user'); // 'user', 'artist', 'upload'

  const renderView = () => {
    switch (currentView) {
      case 'user':
        return <UserProfile />;
      case 'artist':
        return <ArtistProfile />;
      case 'upload':
        return <MusicUploader />;
      default:
        return <UserProfile />;
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