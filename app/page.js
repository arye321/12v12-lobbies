'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function Home() {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const regionMap = {
    "0": "Unspecified",
    "1": "US West",
    "2": "US East",
    "3": "Europe (EU West)",
    "4": "Korea",
    "5": "Singapore",
    "6": "Dubai",
    "7": "Australia",
    "8": "Stockholm (Russia)",
    "9": "Austria (EU East)",
    "10": "Brazil",
    "11": "South Africa",
    "12": "China, Telecom",
    "13": "China, Unicom",
    "14": "Chile",
    "15": "Peru",
    "16": "India",
    "17": "China, Guangdong",
    "18": "China, Zhejiang",
    "19": "Japan",
    "20": "China, Wuhan",
    "25": "China, Tianjin",
    "37": "Taiwan"
  };

  const fetchLobbies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/lobbies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch lobbies');
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Filter lobbies with custom_game_id 1576297063
      const filteredLobbies = result.data.lobbies.filter(
        lobby => lobby.custom_game_id === "1576297063"
      );
      
      setLobbies(filteredLobbies);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobbies();
    
    // Set up polling to refresh data every minute
    const intervalId = setInterval(fetchLobbies, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getRegionName = (regionId) => {
    return regionMap[regionId] || `Unknown Region (${regionId})`;
  };

  return (
    <main>
      <h1>Dota 2 Custom Lobbies (ID: 1576297063)</h1>
      
      <button className="refresh-button" onClick={fetchLobbies}>
        Refresh Lobbies
      </button>
      
      {loading && <div className="loading">Loading lobbies...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <>
          <p>Found {lobbies.length} lobbies with custom game ID 1576297063</p>
          
          <div className="lobbies-container">
            {lobbies.length > 0 ? (
              lobbies.map((lobby) => (
                <div key={lobby.lobby_id} className="lobby-card">
                  <h3>{lobby.leader_name}&apos;s Lobby</h3>
                  <p className="region">Region: {getRegionName(lobby.server_region)}</p>
                  <p className="members">
                    Players: {lobby.member_count}/{lobby.max_player_count}
                  </p>
                  <p>Created: {new Date(lobby.lobby_creation_time * 1000).toLocaleString()}</p>
                  {lobby.has_pass_key && <p>Password Protected</p>}
                </div>
              ))
            ) : (
              <p>No lobbies found with custom game ID 1576297063</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}