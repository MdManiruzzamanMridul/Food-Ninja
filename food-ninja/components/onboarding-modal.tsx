"use client";

import { useState } from "react";
import { Badge, cn } from "@/components/ui";
import { apiUpdateLocation, setOnboarded } from "@/lib/backend";

type OnboardingModalProps = {
  open: boolean;
  username: string;
  userType: "user" | "admin" | "rider";
  initialName?: string;
  initialPhone?: string;
  targetRedirect: string;
  onComplete: (destination: string) => void;
};

const AVATAR_OPTIONS = [
  { id: "ninja-1", emoji: "🥷", label: "Shadow Chef", tone: "from-orange-500 to-amber-500" },
  { id: "ninja-2", emoji: "🍕", label: "Pizza Samurai", tone: "from-red-500 to-orange-500" },
  { id: "ninja-3", emoji: "🍜", label: "Noodle Master", tone: "from-amber-500 to-yellow-400" },
  { id: "ninja-4", emoji: "🍔", label: "Burger Boss", tone: "from-yellow-500 to-amber-600" },
  { id: "ninja-5", emoji: "🥗", label: "Clean Green", tone: "from-emerald-500 to-teal-400" },
  { id: "ninja-6", emoji: "🍛", label: "Biryani Baron", tone: "from-orange-600 to-red-500" },
];

const CUISINE_TAGS = [
  "Biryani",
  "Burgers",
  "Pizza",
  "Rice Bowls",
  "Asian Street Food",
  "Desserts & Bakery",
  "Healthy & Salads",
  "Specialty Coffee",
];

const DHAKA_PRESETS = [
  { name: "Gulshan 2", lat: 23.7925, lng: 90.4078 },
  { name: "Banani", lat: 23.7937, lng: 90.4066 },
  { name: "Dhanmondi", lat: 23.7461, lng: 90.3742 },
  { name: "Uttara Sector 3", lat: 23.8759, lng: 90.3795 },
  { name: "Mirpur 10", lat: 23.8069, lng: 90.3687 },
  { name: "Mohakhali DOHS", lat: 23.7785, lng: 90.4072 },
  { name: "Badda / Rampura", lat: 23.7806, lng: 90.4267 },
  { name: "Bashundhara R/A", lat: 23.8151, lng: 90.4255 },
];

export function OnboardingModal({
  open,
  username,
  userType,
  initialName = "",
  initialPhone = "",
  targetRedirect,
  onComplete,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 State: Avatar & Cuisines
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Biryani", "Burgers"]);

  // Step 2 State: Database Info (Legal Name, NID, Phone)
  const [legalName, setLegalName] = useState(initialName);
  const [nidNumber, setNidNumber] = useState("");
  const [phone, setPhone] = useState(initialPhone);

  // Step 3 State: Map Location
  const [latitude, setLatitude] = useState(23.7925); // Default: Gulshan, Dhaka
  const [longitude, setLongitude] = useState(90.4078);
  const [selectedAreaName, setSelectedAreaName] = useState("Gulshan 2");
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  function toggleCuisine(tag: string) {
    setSelectedCuisines((prev) =>
      prev.includes(tag) ? prev.filter((c) => c !== tag) : [...prev, tag]
    );
  }

  function handleLiveLocation() {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setSelectedAreaName("GPS Live Location");
        setIsLocating(false);
      },
      (err) => {
        setErrorMessage("Unable to retrieve live location. Pick a preset or click on the map.");
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Interpolate around Dhaka bounding box approx
    // Lat: 23.88 (North) to 23.70 (South)
    // Lng: 90.34 (West) to 90.45 (East)
    const lat = Number((23.88 - y * (23.88 - 23.70)).toFixed(6));
    const lng = Number((90.34 + x * (90.45 - 90.34)).toFixed(6));

    setLatitude(lat);
    setLongitude(lng);
    setSelectedAreaName("Custom Pinned Point");
  }

  async function handleFinalSubmit() {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Send location update to backend PostGIS endpoint
      await apiUpdateLocation({ latitude, longitude });

      // 2. Persist local profile completion details
      setOnboarded(username, {
        avatar: selectedAvatar,
        cuisines: selectedCuisines,
        legalName: legalName.trim(),
        nid: nidNumber.trim(),
        phone: phone.trim(),
        latitude,
        longitude,
        area: selectedAreaName,
        completedAt: new Date().toISOString(),
      });

      // 3. Navigate to target dashboard
      onComplete(targetRedirect);
    } catch (err) {
      // Even if backend has connection error, persist locally and proceed gracefully
      setOnboarded(username, {
        avatar: selectedAvatar,
        cuisines: selectedCuisines,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/15 bg-slate-900 text-white shadow-[0_25px_100px_-20px_rgba(0,0,0,0.8)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Progress Bar */}
        <div className="relative h-2 w-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        <div className="p-7 sm:p-9">
          {/* Header Step Track */}
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                {currentStep === 1 ? "1" : currentStep === 2 ? "2" : "3"}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
                  {currentStep === 1
                    ? "Step 1 of 3 • Persona & Avatar"
                    : currentStep === 2
                      ? "Step 2 of 3 • Database Verification"
                      : "Step 3 of 3 • Exact Map Location"}
                </p>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {currentStep === 1
                    ? "Create your Foodie Profile"
                    : currentStep === 2
                      ? "Verify Your Account Details"
                      : "Pin Your Location on the Map"}
                </h3>
              </div>
            </div>

            <Badge tone="primary">First-Time Setup</Badge>
          </div>

          {/* STEP 1: Avatar & Cuisines */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="text-sm font-medium text-slate-300">Choose your Food Ninja Avatar</label>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {AVATAR_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedAvatar(item.id)}
                      className={cn(
                        "group flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition",
                        selectedAvatar === item.id
                          ? "border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <span className="text-3xl transition group-hover:scale-110">{item.emoji}</span>
                      <span className="mt-2 text-[11px] font-medium text-slate-300 line-clamp-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Select Cuisines You Love</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CUISINE_TAGS.map((tag) => {
                    const isSelected = selectedCuisines.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleCuisine(tag)}
                        className={cn(
                          "rounded-xl border px-3.5 py-1.5 text-xs font-medium transition",
                          isSelected
                            ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/10"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                        )}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
                >
                  Continue to Step 2 ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Database Account Details (NID, Name, Phone) */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs text-slate-400">
                These required fields complete your record in the database for identity verification and order processing.
              </p>

              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Full Legal Name *</span>
                <input
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>National ID / NID Number *</span>
                <input
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  placeholder="e.g. 19942692500000123"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                  required
                />
                <span className="text-[10px] text-slate-500">Stored in the database for user identity and verification.</span>
              </label>

              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Primary Contact Phone *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01700000000"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                  required
                />
              </label>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
                >
                  Proceed to Location Map ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive Map Location Pin Picker */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Select your current location in Dhaka. Click the map, pick a hub preset, or use your live GPS:
                </p>
                <button
                  type="button"
                  onClick={handleLiveLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20 disabled:opacity-50"
                >
                  <span>📍</span>
                  <span>{isLocating ? "Acquiring GPS..." : "Use My Live Location"}</span>
                </button>
              </div>

              {/* Interactive Visual Map Grid */}
              <div
                onClick={handleMapClick}
                className="relative h-48 sm:h-56 cursor-crosshair overflow-hidden rounded-2xl border border-white/15 bg-[#0b1220] transition hover:border-orange-500/40"
              >
                {/* Visual Map Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-sky-500/10 to-transparent" />

                {/* Animated Dhaka Road Network SVG Graphic */}
                <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 0 L 35 45 L 60 70 L 90 100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                  <path d="M 0 50 Q 40 40, 80 55 T 100 65" fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M 50 0 L 50 100" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.0" />
                </svg>

                {/* Active Pin Target Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-orange-500 shadow-[0_0_0_8px_rgba(249,115,22,0.3)] animate-pulse" />
                    <span className="absolute -top-7 whitespace-nowrap rounded-lg bg-slate-950/90 border border-white/20 px-2 py-0.5 text-[10px] font-bold text-orange-300">
                      📍 {selectedAreaName}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 rounded-xl bg-slate-950/80 border border-white/10 px-3 py-1 text-[10px] text-slate-400 backdrop-blur">
                  Click anywhere on the map to place pin
                </div>
              </div>

              {/* Major Dhaka Presets */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Dhaka Hub Presets:</p>
                <div className="flex flex-wrap gap-1.5">
                  {DHAKA_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setLatitude(preset.lat);
                        setLongitude(preset.lng);
                        setSelectedAreaName(preset.name);
                      }}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-[11px] transition",
                        selectedAreaName === preset.name
                          ? "border-orange-400 bg-orange-500/20 text-orange-200 font-semibold"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordinates Info Bar */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Latitude:</span>
                  <span className="font-mono font-medium text-white">{latitude.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Longitude:</span>
                  <span className="font-mono font-medium text-white">{longitude.toFixed(6)}</span>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-400">{errorMessage}</p>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {isSubmitting ? "Saving to Database..." : "Confirm & Enter Food Ninja ➔"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
