/**
 * BHHT Datascape World Map Component
 * ===================================
 *
 * Generic component used to render the app's Leaflet maps.
 */
import React from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

export default function WorldMap(props) {
  const {
    center,
    markers
  } = props;

  return (
    <LeafletMap
      className="world-map"
      center={center}
      zoom={3}>
      <TileLayer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'} />
      {
        markers.map(marker => {
          return (
            <Marker
              key={marker.key}
              position={marker.position}>
              <Popup>
                <span>{marker.label}</span>
              </Popup>
            </Marker>
          );
        })
      }
    </LeafletMap>
  );
}
