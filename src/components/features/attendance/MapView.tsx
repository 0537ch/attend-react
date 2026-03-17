import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '@/types/attendance';
import type { OfficeLocation } from '@/types/attendance';
import { officeLocationToLocation } from '@/lib/location';

interface IconDefaultProto {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as IconDefaultProto)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  userLocation: Location | null;
  selectedOffice: OfficeLocation | null;
}

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const officeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function MapView({ userLocation, selectedOffice }: MapViewProps) {
  if (!selectedOffice) {
    return (
      <div className="w-full h-62.5 sm:h-75 md:h-100 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center p-4">
        <p className="text-sm sm:text-base text-muted-foreground text-center">Silakan pilih lokasi kantor terlebih dahulu</p>
      </div>
    );
  }

  const officeLocation = officeLocationToLocation(selectedOffice);
  const radius = selectedOffice.Radius;

  const center = userLocation
    ? {
        lat: (userLocation.lat + officeLocation.lat) / 2,
        lng: (userLocation.lng + officeLocation.lng) / 2,
      }
    : officeLocation;

  return (
    <div className="w-full h-62.5 sm:h-75 md:h-100 rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Office location marker */}
        <Marker position={[officeLocation.lat, officeLocation.lng]} icon={officeIcon} />

        {/* Radius circle */}
        <Circle
          center={[officeLocation.lat, officeLocation.lng]}
          radius={radius}
          pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.1 }}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}
      </MapContainer>
    </div>
  );
}
