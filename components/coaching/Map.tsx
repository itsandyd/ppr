'use client';

import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[]
}

// Light mode uses the standard OpenStreetMap tiles
const lightModeUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// Dark mode uses a dark-themed tile set
const darkModeUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = ({ center }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait for theme to be available on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[35vh] rounded-lg bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
    );
  }

  const isDark = theme === 'dark';
  const mapUrl = isDark ? darkModeUrl : lightModeUrl;

  return (
    <div className="border-2 rounded-lg overflow-hidden border-neutral-200 dark:border-neutral-700 theme-transition">
      <MapContainer 
        center={center as L.LatLngExpression || [51, -0.09]} 
        zoom={center ? 4 : 2} 
        scrollWheelZoom={false} 
        className="h-[35vh] transition-all"
        attributionControl={false}
      >
        <TileLayer
          url={mapUrl}
          attribution={attribution}
        />
        {center && (
          <Marker position={center as L.LatLngExpression} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;