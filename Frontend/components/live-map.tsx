"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export function LiveMap({
  title,
  subtitle,
  center = [23.7925, 90.4078],
  zoom = 13,
}: {
  title: string;
  subtitle: string;
  center?: [number, number];
  zoom?: number;
  accent?: "orange" | "emerald" | "sky";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!containerRef.current || mapRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !containerRef.current || mapRef.current) return;
      if ((containerRef.current as any)._leaflet_id) return;

      const map = L.map(containerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      if (!isMounted) {
        map.remove();
        return;
      }

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Pulse pin for current center
      const pinIcon = L.divIcon({
        className: "live-map-pin",
        html: `
          <div style="position: relative; width: 24px; height: 24px; transform: translate(-50%, -50%);">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: rgba(245, 158, 11, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 24px; height: 24px; border-radius: 9999px; background: #f59e0b; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(center, { icon: pinIcon }).addTo(map);
    }

    init();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (containerRef.current && (containerRef.current as any)._leaflet_id) {
        (containerRef.current as any)._leaflet_id = null;
      }
    };
  }, [center, zoom]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 bg-slate-50/80">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500 uppercase tracking-wider">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600">OpenStreetMap Live</span>
        </div>
      </div>
      <div className="relative h-[320px] w-full bg-slate-100">
        <div ref={containerRef} className="h-full w-full z-0" />
      </div>
    </div>
  );
}
