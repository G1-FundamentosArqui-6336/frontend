import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import type { LatLngLiteral } from 'leaflet';

function ClickHandler({ onSelect }: { onSelect: (pos: LatLngLiteral) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function MapPicker({
  position,
  onChange,
}: {
  position?: { lat: number; lng: number } | null;
  onChange: (pos: { lat: number; lng: number } | null) => void;
}) {
  const center = position ?? { lat: 0, lng: 0 };

  return (
    <div className="h-72 rounded overflow-hidden border">
      <MapContainer center={[center.lat, center.lng]} zoom={position ? 13 : 2} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onSelect={(latlng) => onChange({ lat: latlng.lat, lng: latlng.lng })} />
        {position && <CircleMarker center={[position.lat, position.lng]} radius={8} pathOptions={{ color: '#2563eb' }} />}
      </MapContainer>
    </div>
  );
}
