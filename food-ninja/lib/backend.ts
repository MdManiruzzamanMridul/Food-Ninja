export type BackendMode = "live" | "demo";

export type BackendResponse<T> = {
  ok: boolean;
  mode: BackendMode;
  endpoint: string;
  data: T;
  message?: string;
};

export type AuthUser = {
  username: string;
  user_type: "user" | "admin";
  email?: string;
};

export type UserLoginPayload = {
  user_type: "user";
  email: string;
  phone: string;
  password: string;
};

export type AdminLoginPayload = {
  user_type: "admin";
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginPayload = UserLoginPayload | AdminLoginPayload;

export type UserRegisterPayload = {
  user_type: "user";
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type AdminRegisterPayload = {
  user_type: "admin";
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type RegisterPayload = UserRegisterPayload | AdminRegisterPayload;

export type LoginResponse = {
  success: boolean;
  token?: string;
  username?: string;
  user_type?: "user" | "admin";
  message?: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Auth token storage helpers (localStorage)
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("food_ninja_token");
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("food_ninja_user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("food_ninja_token", token);
  localStorage.setItem("food_ninja_user", JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("food_ninja_token");
  localStorage.removeItem("food_ninja_user");
}

// Direct API calls to Flask Backend matching login.py exactly
export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to log in");
  }

  if (data.token) {
    setAuthSession(data.token, {
      username: data.username || (payload.user_type === "admin" ? payload.username : payload.email),
      user_type: data.user_type || payload.user_type,
      email: payload.email,
    });
  }

  return data;
}

export async function apiRegister(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to register");
  }

  return data;
}

export async function apiGetPendingOrders() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated. Please log in.");
  }

  const res = await fetch(`${BACKEND_URL}/pending_orders_user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data.orders || [];
}

// Universal platform request dispatcher
export async function submitPlatformRequest<T>(
  endpoint: string,
  payload: Record<string, unknown> = {},
): Promise<BackendResponse<T>> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        ok: true,
        mode: "live",
        endpoint,
        data: data as T,
      };
    }
  } catch {
    // If backend is unreachable or endpoint is not defined in Flask yet, fallback gracefully
  }

  return {
    ok: true,
    mode: "demo",
    endpoint,
    data: payload as T,
  };
}

// Update user/rider location via Flask Backend PostGIS endpoint
export async function apiUpdateLocation(payload: { latitude: number; longitude: number }): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const res = await fetch(`${BACKEND_URL}/users/me/location`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update location");
  }

  return data;
}

// Onboarding persistence helpers
export function isOnboarded(username: string): boolean {
  if (typeof window === "undefined" || !username) return false;
  return localStorage.getItem(`food_ninja_onboarded_${username}`) === "true";
}

export function setOnboarded(username: string, details?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !username) return;
  localStorage.setItem(`food_ninja_onboarded_${username}`, "true");
  if (details) {
    localStorage.setItem(`food_ninja_profile_${username}`, JSON.stringify(details));
  }
}

export function getOnboardingDetails(username: string): Record<string, unknown> | null {
  if (typeof window === "undefined" || !username) return null;
  const data = localStorage.getItem(`food_ninja_profile_${username}`);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
