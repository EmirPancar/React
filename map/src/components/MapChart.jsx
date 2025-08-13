import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom); }, [center, zoom, map]);
  return null;
}
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => { map.invalidateSize(); }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

const MapChart = () => {
  const { selectedCity } = useSelector((state) => state.map);
  const turkeyBounds = [ [35.5, 25.0], [42.5, 45.0] ];

  return (
    <MapContainer
      className="leaflet-container"
      center={[39, 35]}
      zoom={6}
      maxBounds={turkeyBounds}
      minZoom={6}
      maxBoundsViscosity={1.0}
      zoomControl={false} 
    >
      <ChangeView
        center={selectedCity ? selectedCity.coordinates : [39, 35]}
        zoom={selectedCity ? 12 : 6}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ZoomControl position="bottomright" />

      {selectedCity && (
        <Marker position={selectedCity.coordinates}>
          <Popup>{selectedCity.name}</Popup>
        </Marker>
      )}
      
      <MapResizer />
    </MapContainer>
  );
};

export default MapChart;