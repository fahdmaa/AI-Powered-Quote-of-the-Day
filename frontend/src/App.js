import React, { useState } from 'react';
import './App.css';
import { mockPlaylist } from './mockData.js';

function App() {
  const [playlist, setPlaylist] = useState([]);

  const getPlaylist = () => {
    setPlaylist(mockPlaylist);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'MoodStream Playlist',
        text: 'Check out this playlist I generated with MoodStream!',
        url: window.location.href
      });
    } catch (err) {
      console.error('Share failed:', err);
      // As a fallback for browsers that don't support navigator.share or if it fails,
      // we can copy the URL to the clipboard.
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(clipErr => {
        console.error('Clipboard copy failed:', clipErr);
        alert('Could not share or copy link.');
      });
    }
  };

  return (
    <div id="app-container">
      <button id="share-button" onClick={handleShare}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="m6 12 8 4"/><path d="m10 8-4 4"/>
        </svg>
      </button>

      <h1>MoodStream</h1>

      <div id="mood-selector">
        <button onClick={getPlaylist}>Happy</button>
        <button onClick={getPlaylist}>Chill</button>
        <button onClick={getPlaylist}>Workout</button>
        <button onClick={getPlaylist}>Focus</button>
      </div>

      <div id="playlist-display">
        {playlist.map((track, index) => (
          <div key={index} className="track">
            <img src={track.artworkUrl} alt={`Artwork for ${track.trackName}`} />
            <div className="track-info">
              <div className="track-name">{track.trackName}</div>
              <div className="artist-name">{track.artistName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
