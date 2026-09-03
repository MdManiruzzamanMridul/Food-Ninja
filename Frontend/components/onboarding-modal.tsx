"use client";

import { useState, useEffect } from "react";
import { cn } from "@/components/ui";
import { apiUpdateLocation, apiUpdateUsername, setOnboarded } from "@/lib/backend";
import { OSMLocationPicker } from "./osm-location-picker";

type AvatarOption = {
  id: string;
  name: string;
  role: string;
  initials: string;
  badgeTone: string;
};

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "ninja-chef", name: "Chef Ronin", role: "Culinary Master", initials: "CR", badgeTone: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "ninja-blade", name: "Courier Blade", role: "Swift Dispatch", initials: "CB", badgeTone: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "ninja-shadow", name: "Night Owl", role: "Midnight Foodie", initials: "NO", badgeTone: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "ninja-sensei", name: "Speed Sensei", role: "Express Taster", initials: "SS", badgeTone: "bg-sky-100 text-sky-800 border-sky-300" },
  { id: "ninja-dragon", name: "Dragon Flame", role: "Spice Explorer", initials: "DF", badgeTone: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "ninja-master", name: "Street Sensei", role: "Dhaka Local", initials: "SL", badgeTone: "bg-amber-100 text-amber-800 border-amber-300" },
];

const CUISINE_OPTIONS = [
  "Dhaka Biryani",
  "Street Kebab",
  "Artisan Burgers",
  "Neapolitan Pizza",
  "Pan-Asian & Dimsum",
  "Traditional Bengali",
  "Japanese Ramen",
  "Specialty Coffee",
  "Craft Desserts",
];

export function OnboardingModal({
  open,
  username,
  userType = "user",
  initialPhone = "",
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Profile & Cuisines
  const [selectedAvatar, setSelectedAvatar] = useState("ninja-chef");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Dhaka Biryani", "Artisan Burgers"]);

  // Step 2: Missing Database Information & Chosen Username
  const [customUsername, setCustomUsername] = useState(username || "");
  const [legalName, setLegalName] = useState(username ? username.charAt(0).toUpperCase() + username.slice(1) : "");
  const [nidNumber, setNidNumber] = useState("");
  const [phone, setPhone] = useState(initialPhone || "");

  // Step 3: Location / Map Coordinates
  const [latitude, setLatitude] = useState(23.7925);
  const [longitude, setLongitude] = useState(90.4078);
  const [selectedAreaName, setSelectedAreaName] = useState("Gulshan 2, Dhaka");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin accounts do not need persona, fav food, or customer onboarding
  useEffect(() => {
    if (open && userType === "admin") {
      setOnboarded(username);
      onComplete(targetRedirect);
    }
  }, [open, userType, username, targetRedirect, onComplete]);

  if (!open || userType === "admin") return null;

  function toggleCuisine(c: string) {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  }

  async function handleFinalSubmit() {
    setIsSubmitting(true);
    const finalUser = customUsername.trim().toLowerCase() || username;

    try {
      // 1. If username was chosen, update backend & session
      if (finalUser) {
        await apiUpdateUsername(finalUser);
      }

      // 2. Send location update to backend PostGIS endpoint
      await apiUpdateLocation({ latitude, longitude });

      // 3. Persist local profile completion details
      setOnboarded(finalUser, {
        avatar: selectedAvatar,
        cuisines: selectedCuisines,
        username: finalUser,
        legalName: legalName.trim(),
        nid: nidNumber.trim(),
        phone: phone.trim(),
        latitude,
        longitude,
        area: selectedAreaName,
        completedAt: new Date().toISOString(),
      });

      // 4. Navigate to target dashboard
      onComplete(targetRedirect);
    } catch {
      setOnboarded(finalUser, {
        avatar: selectedAvatar,
        cuisines: selectedCuisines,
        username: finalUser,
        legalName: legalName.trim(),
        nid: nidNumber.trim(),
        phone: phone.trim(),
        latitude,
        longitude,
        area: selectedAreaName,
        offlineFallback: true,
      });

      onComplete(targetRedirect);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white text-slate-900 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step Progress Top Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
                First-Time Setup
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                {currentStep === 1 ? "01 Identity" : currentStep === 2 ? "02 Verification" : "03 Realtime Map"}
              </span>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
              Stage {currentStep} of 3
            </span>
          </div>

          {/* Segmented Step Indicator */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  step <= currentStep ? "bg-amber-500 shadow-sm" : "bg-slate-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: Persona & Avatar */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Select Profile Avatar & Cuisines
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Personalize your avatar badge and cuisine preferences for custom dish recommendations.
                </p>
              </div>

              {/* Avatar Grid */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Choose Persona
                </span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AVATAR_OPTIONS.map((item) => {
                    const isSelected = selectedAvatar === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedAvatar(item.id)}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-150",
                          isSelected
                            ? "border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20"
                            : "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100/70"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-transform group-hover:scale-105",
                            item.badgeTone
                          )}
                        >
                          {item.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {item.name}
                          </p>
                          <p className="truncate text-[10px] text-slate-500 font-medium">
                            {item.role}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuisines Tag Cloud */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Favorite Dhaka Flavors
                </span>
                <div className="flex flex-wrap gap-2">
                  {CUISINE_OPTIONS.map((cuisine) => {
                    const active = selectedCuisines.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => toggleCuisine(cuisine)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                          active
                            ? "border-amber-500 bg-amber-500 text-white font-semibold shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {active ? "✓ " : "+ "}
                        {cuisine}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-600 shadow-md shadow-amber-500/25"
                >
                  <span>Continue to Verification</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Database Account Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Account Verification & Profile Details
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Provide your primary contact and identification number for official order dispatch & rider coordination.
                </p>
              </div>

              <div className="space-y-4">
                {/* Choose Username */}
                <label className="block space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Choose Your Food Ninja Username *</span>
                    <span className="text-[10px] font-semibold text-amber-700">Unique Portal Handle</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-semibold text-slate-400">@</span>
                    <input
                      value={customUsername}
                      onChange={(e) => setCustomUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                      placeholder="e.g. foodlover99"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Your handle is used for orders, delivery tracking receipts, and fast login.
                  </p>
                </label>

                {/* Legal Name */}
                <label className="block space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center justify-between">
                    <span>Full Legal Name *</span>
                    <span className="text-[10px] text-slate-400">Database: `users.name`</span>
                  </div>
                  <input
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </label>

                {/* NID */}
                <label className="block space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center justify-between">
                    <span>National ID / NID Number *</span>
                    <span className="text-[10px] text-slate-400">Identity Verification</span>
                  </div>
                  <input
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    placeholder="e.g. 19942692500000123"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Stored for customer identity and order verification.</span>
                </label>

                {/* Primary Contact Phone */}
                <label className="block space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center justify-between">
                    <span>Primary Contact Phone *</span>
                    <span className="text-[10px] text-slate-400">Database: `users.phone`</span>
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Riders and restaurants will use this number for delivery coordination.</span>
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-full border border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  ← Back to Avatar
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-600 shadow-md shadow-amber-500/25"
                >
                  <span>Continue to Realtime Map</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Realtime OpenStreetMap Location Picker */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Select Delivery Pin on OpenStreetMap
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  Drag the custom pin or click anywhere on the realtime OpenStreetMap street grid to set your delivery coordinates.
                </p>
              </div>

              {/* Realtime OSM Location Picker Component */}
              <OSMLocationPicker
                initialLat={latitude}
                initialLng={longitude}
                onLocationChange={(lat, lng, address) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  if (address) setSelectedAreaName(address);
                }}
              />

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-full border border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-600 shadow-lg shadow-amber-500/25 disabled:cursor-wait disabled:opacity-70"
                >
                  <span>{isSubmitting ? "Saving Coordinates..." : "Save Location & Launch ➔"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
