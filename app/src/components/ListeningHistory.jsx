import React from "react";

// Affiche un seul élément d'historique, en recevant directement l'objet track
const HistoryItem = ({ track }) => {
  // Sécurisation des accès aux images
  const albumImage = track.album.images?.[0]?.url || "";
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div className="track-grid">
      <div className="grid-item-image">
        <img src={albumImage} alt={track.name} />
      </div>
      <div className="grid-item-name">
        <div className="title">{track.name}</div>
      </div>
      <div className="grid-item-from">
        <div className="subtitle">
          {artistNames} &#x25CF; {track.album.name}
        </div>
      </div>
    </div>
  );
};

// Liste l'historique des pistes récemment jouées
const ListeningHistory = ({ recentlyPlayedTracks }) => {
  return (
    <div className="recent-streams">
      <h2>Recent streams</h2>
      <div className="subtitle">Your most recently played tracks</div>
      <div className="grid-container">
        {recentlyPlayedTracks.map((track, index) => (
          <HistoryItem key={index} track={track} />
        ))}
      </div>
    </div>
  );
};

export default ListeningHistory;
