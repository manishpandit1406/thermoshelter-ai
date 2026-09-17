'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet under Next.js/Webpack
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, name?: string, elevation?: string) => void;
}

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
  const map = useMapEvents({
    async click(e) {
      const newLat = e.latlng.lat;
      const newLng = e.latlng.lng;
      map.flyTo(e.latlng, map.getZoom());
      
      // Default immediately update coords
      onChange(newLat, newLng);

      try {
        // Fetch Location Name (Reverse Geocoding via Nominatim)
        let locName = '';
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.address) {
             const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state_district || geoData.name;
             const state = geoData.address.state || geoData.address.country;
             if (city && state) locName = `${city}, ${state}`;
             else if (city) locName = city;
             else if (geoData.name) locName = geoData.name;
             else locName = geoData.display_name?.split(',').slice(0, 2).join(',');
          } else if (geoData.display_name) {
             locName = geoData.display_name.split(',').slice(0, 2).join(',');
          }
        }

        // Fetch Elevation (via Open-Meteo)
        let elev = '';
        const elevRes = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${newLat}&longitude=${newLng}`);
        if (elevRes.ok) {
          const elevData = await elevRes.json();
          if (elevData.elevation && elevData.elevation.length > 0) {
            elev = Math.round(elevData.elevation[0]).toString();
          }
        }

        // Update with full data if fetched
        if (locName || elev) {
          onChange(newLat, newLng, locName, elev);
        }
      } catch (err) {
        console.error("Failed to fetch location metadata:", err);
      }
    },
  });

  // Center map on external coord change (e.g. preset clicked)
  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  if (isNaN(lat) || isNaN(lng)) return null;

  return <Marker position={[lat, lng]} icon={icon} />;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <MapContainer
        center={!isNaN(lat) && !isNaN(lng) ? [lat, lng] : defaultCenter}
        zoom={!isNaN(lat) && !isNaN(lng) ? 10 : 4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
