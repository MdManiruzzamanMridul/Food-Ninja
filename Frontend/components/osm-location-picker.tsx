"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type OSMLocationPickerProps = {
  initialLat: number;
  initialLng: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
};

export const DHAKA_PRESETS = [
  { name: "Gulshan 2", lat: 23.7925, lng: 90.4078 },
  { name: "Banani 11", lat: 23.7937, lng: 90.4042 },
  { name: "Dhanmondi 27", lat: 23.7533, lng: 90.3769 },
  { name: "Uttara Sector 3", lat: 23.8728, lng: 90.3985 },
  { name: "Mirpur 10", lat: 23.8069, lng: 90.3687 },
  { name: "Mohakhali DOHS", lat: 23.7776, lng: 90.3988 },
  { name: "Bashundhara R/A", lat: 23.8191, lng: 90.4278 },
  { name: "Badda / Rampura", lat: 23.7684, lng: 90.4255 },
];

export function OSMLocationPicker({
  initialLat,
  initialLng,
  onLocationChange,
}: OSMLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [currentCoords, setCurrentCoords] = useState({ lat: initialLat, lng: initialLng });
  const [addressName, setAddressName] = useState<string>("Locating area...");
  const [isLocating, setIsLocating] = useState(false);

  // Reverse geocoding with debounce/cooldown using Nominatim
  async function fetchAddress(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const display =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.road ||
          data.address?.city_district ||
          data.display_name?.split(",")[0] ||
          "Dhaka City Point";
        setAddressName(`${display}, Dhaka`);
        onLocationChange(lat, lng, `${display}, Dhaka`);
        return;
      }
    } catch {
      // Fallback
    }
    const fallback = `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    setAddressName(fallback);
    onLocationChange(lat, lng, fallback);
  }

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      // Ensure component is still mounted and container hasn't been initialized yet
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;
      if ((mapContainerRef.current as any)._leaflet_id) return;

      // Custom Amber Pulsing Pin Icon
      const customPinIcon = L.divIcon({
        className: "custom-osm-pin",
        html: `
          <div style="position: relative; width: 34px; height: 34px; transform: translate(-50%, -100%);">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: rgba(245, 158, 11, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 34px; height: 34px; border-radius: 9999px; background: #f59e0b; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); display: flex; items-center: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background: #ffffff; margin-top: 10px; margin-left: 10px;"></div>
            </div>
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #f59e0b;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      if (!isMounted) {
        map.remove();
        return;
      }

      mapInstanceRef.current = map;

      // Realtime OpenStreetMap standard street tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add draggable pin
      const marker = L.marker([initialLat, initialLng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Handle marker dragging
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        const lat = parseFloat(pos.lat.toFixed(6));
        const lng = parseFloat(pos.lng.toFixed(6));
        setCurrentCoords({ lat, lng });
        fetchAddress(lat, lng);
      });

      // Handle map clicks
      map.on("click", (e: any) => {
        const lat = parseFloat(e.latlng.lat.toFixed(6));
        const lng = parseFloat(e.latlng.lng.toFixed(6));
        marker.setLatLng([lat, lng]);
        setCurrentCoords({ lat, lng });
        fetchAddress(lat, lng);
      });

      // Initial address fetch
      fetchAddress(initialLat, initialLng);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, [initialLat, initialLng]);

  function handleSelectPreset(preset: typeof DHAKA_PRESETS[0]) {
    if (!mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.flyTo([preset.lat, preset.lng], 15, { duration: 1 });
    markerRef.current.setLatLng([preset.lat, preset.lng]);
    setCurrentCoords({ lat: preset.lat, lng: preset.lng });
    setAddressName(`${preset.name}, Dhaka`);
    onLocationChange(preset.lat, preset.lng, `${preset.name}, Dhaka`);
  }

  function handleUseLiveGPS() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
          markerRef.current.setLatLng([lat, lng]);
        }
        setCurrentCoords({ lat, lng });
        fetchAddress(lat, lng);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert("Unable to retrieve your location. Please select on the map.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="space-y-3">
      {/* Area Presets & Live GPS button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none max-w-full sm:max-w-[70%]">
          {DHAKA_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 transition shadow-xs"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleUseLiveGPS}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50 shadow-xs"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
          <span>{isLocating ? "Detecting GPS..." : "My Live GPS"}</span>
        </button>
      </div>

      {/* Realtime OpenStreetMap Canvas Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
        <div
          ref={mapContainerRef}
          className="h-64 w-full z-0"
          style={{ minHeight: "260px" }}
        />

        {/* Realtime Floating Coordinates HUD */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 line-clamp-1">
              {addressName}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 hidden sm:inline-block">
            {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
          </span>
        </div>
      </div>
    </div>
  );
}
