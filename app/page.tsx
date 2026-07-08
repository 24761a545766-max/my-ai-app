'use client';

import { useState } from 'react';

interface ShelterLocation {
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export default function CycloneDashboard() {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [safeShelter, setSafeShelter] = useState<ShelterLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // 📡 Step 1: Capture live browser location and sync with backend pipeline
  const findSafeLocation = () => {
    if (!navigator.geolocation) {
      setStatusMsg("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setStatusMsg("Retrieving precise GPS telemetry...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });

        try {
          setStatusMsg("Calculating closest secure shelter sector...");
          
          // Step 2: Push telemetry packet to our MongoDB endpoint route
          const response = await fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
              city: "User Local Sector",
              windSpeed: 45, // Simulated tracking parameter
              threatActive: true,
              sosTriggered: false
            })
          });

          const result = await response.json();

          if (result.success && result.assignedShelter) {
            setSafeShelter(result.assignedShelter);
            setStatusMsg("Secure routing path ingestion complete.");
          } else {
            setStatusMsg("Connected to server, but fallback calculation failed.");
          }
        } catch (error) {
          console.error("Pipeline Sync Error:", error);
          setStatusMsg("Network failure connecting to telemetry backend.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setStatusMsg("Unable to retrieve location settings. Ensure permissions are allowed.");
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #ef4444', paddingBottom: '0.5rem' }}>
        🌪️ Cyclone Track Telemetry Matrix
      </h2>
      
      <p style={{ color: '#666' }}>
        Click below to securely transmit your current coordinate tracking parameters and pinpoint your assigned shelter zone.
      </p>

      <button 
        onClick={findSafeLocation} 
        disabled={loading}
        style={{
          background: '#ef4444', color: '#fff', border: 'none', 
          padding: '0.75rem 1.5rem', borderRadius: '4px', fontSize: '1rem', 
          cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold'
        }}
      >
        {loading ? 'Processing Telemetry...' : 'Locate Nearest Safe Zone'}
      </button>

      {statusMsg && <p style={{ fontStyle: 'italic', margin: '1rem 0', color: '#4b5563' }}>{statusMsg}</p>}

      {/* 📍 Render Current User Location Coordinates */}
      {userCoords && (
        <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '4px', margin: '1rem 0' }}>
          <strong>Your Telemetry Location:</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
            <li>Latitude: <span style={{ fontFamily: 'monospace' }}>{userCoords.lat.toFixed(6)}°</span></li>
            <li>Longitude: <span style={{ fontFamily: 'monospace' }}>{userCoords.lng.toFixed(6)}°</span></li>
          </ul>
        </div>
      )}

      {/* 🛡️ Render Safe Shelter Coordinates Received From Backend */}
      {safeShelter && (
        <div style={{ background: '#dcfce7', border: '1px solid #22c55e', padding: '1.25rem', borderRadius: '4px', marginTop: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#15803d' }}>✅ Assigned Emergency Safe Zone</h3>
          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Facility Name:</strong> {safeShelter.name}</p>
          <ul style={{ margin: '0', paddingLeft: '1.2rem' }}>
            <li>Assigned Latitude: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{safeShelter.latitude}°</span></li>
            <li>Assigned Longitude: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{safeShelter.longitude}°</span></li>
            <li>Calculated Proximity: <span>~{safeShelter.distanceKm.toFixed(2)} km away</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}