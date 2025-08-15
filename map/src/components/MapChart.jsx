import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, GeoJSON, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import turkeyProvinces from '../turkey-provinces.json';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const hiddenIcon = new L.DivIcon({
    className: 'hidden-marker-icon',
    iconSize: [0, 0] 
});


function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom); }, [center, zoom, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => { map.invalidateSize(); }, 400);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}
// --- ---

const MapChart = () => {
  const { selectedCity } = useSelector((state) => state.map);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const turkeyBounds = [ [35.5, 25.0], [42.5, 45.0] ];

  const getStyle = (feature) => {
    const cityName = feature?.properties?.name;
    
    if (selectedCity && cityName === selectedCity.name) {
      return {
        fillColor: '#3498db', weight: 3, color: '#2980b9', fillOpacity: 0.7,
      };
    }
    if (cityName === hoveredCity) {
      return {
        fillColor: '#f1c40f', weight: 2, color: '#f39c12', fillOpacity: 0.6,
      };
    }
    return {
      fillColor: 'rgba(149, 165, 166, 0)', weight: 1, color: 'white', fillOpacity: 0,
    };
  };

  const onEachFeature = (feature, layer) => {
    const cityName = feature?.properties?.name;
    if (cityName) {
      layer.on({
        mouseover: (event) => {
          const center = event.target.getBounds().getCenter();
          setTooltipPosition(center);
          setHoveredCity(cityName);
        },
        mouseout: () => {
          setTooltipPosition(null);
          setHoveredCity(null);
        },
      });
    }
  };
  
  const geoJsonKey = `geojson-${selectedCity?.name || 'none'}-${hoveredCity || 'none'}`;

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
        zoom={selectedCity ? 10 : 6}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ZoomControl position="bottomright" />

      <GeoJSON 
        key={geoJsonKey}
        data={turkeyProvinces} 
        style={getStyle} 
        onEachFeature={onEachFeature}
      />

      {hoveredCity && tooltipPosition && (
        <Marker position={tooltipPosition} icon={hiddenIcon}>
          <Tooltip
            permanent
            direction="center"
            offset={[0, 0]} 
            className="city-tooltip"
          >
            {hoveredCity}
          </Tooltip>
        </Marker>
      )}

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