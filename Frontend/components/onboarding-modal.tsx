import { useEffect, useState } from "react";
import { apiUpdateLocation, setOnboarded } from "@/lib/backend";
import { OSMLocationPicker } from "./osm-location-picker";

export function OnboardingModal({
  open,
  username,
  userType = "user",
  targetRedirect = "/home",
  onComplete,
}: {
  open: boolean;
  username: string;
  userType?: string;
  initialPhone?: string;
  targetRedirect?: string;
  onComplete: (destination: string) => void;
}) {
  const [latitude, setLatitude] = useState(23.7925);
  const [longitude, setLongitude] = useState(90.4078);
  const [selectedAreaName, setSelectedAreaName] = useState("Gulshan 2, Dhaka");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && userType === "admin") {
      setOnboarded(username);
      onComplete(targetRedirect);
    }
  }, [open, userType, username, targetRedirect, onComplete]);

  if (!open || userType === "admin") return null;

  async function handleFinalSubmit() {
    setIsSubmitting(true);

    try {
      await apiUpdateLocation({ latitude, longitude });
      setOnboarded(username, {
        username,
        latitude,
        longitude,
        area: selectedAreaName,
        completedAt: new Date().toISOString(),
      });
    } catch {
      setOnboarded(username, {
        username,
        latitude,
        longitude,
        area: selectedAreaName,
        offlineFallback: true,
      });
    } finally {
      setIsSubmitting(false);
      onComplete(targetRedirect);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white text-slate-900 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
              Delivery Setup
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
              Location
            </span>
          </div>
        </div>

        <div className="space-y-5 overflow-y-auto p-6 sm:p-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Set Your Delivery Location
            </h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Drag the pin or click anywhere on the map to set your delivery coordinates.
            </p>
          </div>

          <OSMLocationPicker
            initialLat={latitude}
            initialLng={longitude}
            onLocationChange={(lat, lng, address) => {
              setLatitude(lat);
              setLongitude(lng);
              if (address) setSelectedAreaName(address);
            }}
          />

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
            >
              <span>{isSubmitting ? "Saving Location..." : "Save Location & Launch"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
