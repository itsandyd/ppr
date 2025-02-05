"use client"

import { TrackSearch } from "@/components/music/track-search";
import { MusicNavbar } from "@/components/music/music-navbar";
import React, { useState, useEffect } from 'react';

const CLIENT_ID = "eb50c2830540448d99e4f2342c2a8d87";
const CLIENT_SECRET = "d344df747b684472b5de0b3c9d8e2175";

export default function SpotifyPage() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => {
        setAccessToken(data.access_token);
      });
  }, []);

  return (
    <div className="h-full">
      <MusicNavbar />
      <div className="p-6">
        <TrackSearch accessToken={accessToken} onSearch={(query) => {
          // Implement search functionality
          console.log("Searching for:", query);
        }} />
      </div>
    </div>
  );
}