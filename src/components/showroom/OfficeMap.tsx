import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Office } from '../../types/catalog';
import { directionsUrl } from '../../utils/format';

interface OfficeMapProps {
  offices: Office[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const pin = (active: boolean) =>
L.divIcon({
  className: '',
  html: `<span style="display:block;width:${active ? 22 : 16}px;height:${active ? 22 : 16}px;border-radius:9999px;background:#D4AF37;border:3px solid #111;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
  iconSize: active ? [22, 22] : [16, 16],
  iconAnchor: active ? [11, 11] : [8, 8]
});

function MapController({ offices, selectedId }: {offices: Office[];selectedId: string | null;}) {
  const map = useMap();
  useEffect(() => {
    const target = offices.find((o) => o.id === selectedId);
    if (target) map.flyTo([target.lat, target.lng], 14, { duration: 0.6 });else
    if (offices.length) map.fitBounds(L.latLngBounds(offices.map((o) => [o.lat, o.lng] as [number, number])), { padding: [60, 60] });
  }, [selectedId, offices, map]);
  return null;
}

export function OfficeMap({ offices, selectedId, onSelect }: OfficeMapProps) {
  useEffect(() => {
    if (document.querySelector(`link[href="${LEAFLET_CSS}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }, []);

  const center: [number, number] = offices.length ? [offices[0].lat, offices[0].lng] : [9.082, 8.6753];

  return (
    <MapContainer center={center} zoom={6} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {offices.map((o) =>
      <Marker key={o.id} position={[o.lat, o.lng]} icon={pin(o.id === selectedId)} eventHandlers={{ click: () => onSelect(o.id) }}>
          <Popup>
            <strong style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18 }}>{o.name}</strong>
            <br />
            {o.address}, {o.city}
            <br />
            <a href={directionsUrl(o.lat, o.lng)} target="_blank" rel="noopener noreferrer">
              Get directions →
            </a>
          </Popup>
        </Marker>
      )}
      <MapController offices={offices} selectedId={selectedId} />
    </MapContainer>);

}