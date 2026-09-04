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
  user_type: "user" | "admin" | "rider" | "owner";
  email?: string;
  name?: string;
  status?: string;
};

export type LoginPayload = {
  user_type: "user" | "admin" | "rider" | "owner";
  user_info: string;
  password: string;
};

export type UserRegisterPayload = {
  user_type: "user";
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type RiderRegisterPayload = {
  user_type: "rider";
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicle: "bike" | "bicycle";
};

export type AdminRegisterPayload = {
  user_type: "admin";
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type OwnerRegisterPayload = {
  user_type: "owner";
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  nid?: string;
};

export type RegisterPayload = UserRegisterPayload | RiderRegisterPayload | AdminRegisterPayload | OwnerRegisterPayload;

export type LoginResponse = {
  success: boolean;
  token?: string;
  username?: string;
  user_type?: "user" | "admin" | "rider" | "owner";
  status?: string;
  message?: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
};

export type UpdateResponse = {
  success: boolean;
  message: string;
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
      username: data.username || payload.user_info,
      user_type: data.user_type || payload.user_type,
      status: data.status,
    });
  }

  return data;
}

export async function apiLogout(): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // If server is unreachable, continue clearing client session
    }
  }

  clearAuthSession();
  return { success: true, message: "Logged out successfully" };
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

export async function apiUpdateEmail(newEmail: string, password: string): Promise<UpdateResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const res = await fetch(`${BACKEND_URL}/users/me/email`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_email: newEmail,
      password: password,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update email");
  }

  return data;
}

export async function apiUpdatePhone(newPhone: string, password: string): Promise<UpdateResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const res = await fetch(`${BACKEND_URL}/users/me/phone`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_phone: newPhone,
      password: password,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update phone number");
  }

  return data;
}

export async function apiChangePassword(oldPassword: string, newPassword: string): Promise<UpdateResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const res = await fetch(`${BACKEND_URL}/users/me/password`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
}

export async function apiCheckUsername(username: string): Promise<{ available: boolean; message: string }> {
  const clean = username.trim().toLowerCase();
  if (!clean) return { available: false, message: "Username cannot be empty" };
  try {
    const res = await fetch(`${BACKEND_URL}/users/check_username?username=${encodeURIComponent(clean)}`);
    const data = await res.json();
    return data;
  } catch {
    return { available: true, message: "Offline check" };
  }
}

export async function apiUpdateUsername(newUsername: string, password?: string): Promise<UpdateResponse> {
  const token = getAuthToken();
  const current = getAuthUser();
  const cleanUsername = newUsername.trim().toLowerCase();

  if (!cleanUsername) {
    throw new Error("Username cannot be empty");
  }

  if (token) {
    const res = await fetch(`${BACKEND_URL}/users/me/username`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_username: cleanUsername,
        password: password || "",
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        setAuthSession(data.token, {
          username: cleanUsername,
          user_type: current?.user_type || "user",
          email: current?.email,
        });
      } else if (current) {
        setAuthSession(token, {
          ...current,
          username: cleanUsername,
        });
      }
      return data;
    } else {
      throw new Error(data.message || `Failed to update username (${res.status})`);
    }
  }

  if (current) {
    setAuthSession(token || "client_token", {
      ...current,
      username: cleanUsername,
    });
  }

  return { success: true, message: "Username updated successfully!" };
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

// Owner & Admin API helpers
export async function apiGetOwnerStatus(): Promise<{ success: boolean; status: string; name?: string; email?: string; phone?: string; nid?: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BACKEND_URL}/owner/status`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch owner status");
  return data;
}

export type OwnerRestaurant = {
  restaurant_id: string;
  name: string;
  latitude: number;
  longitude: number;
  open_time: string;
  close_time: string;
  status: string;
};

export async function apiGetOwnerRestaurants(): Promise<OwnerRestaurant[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BACKEND_URL}/owner/restaurants`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    return data.success && Array.isArray(data.restaurants) ? data.restaurants : [];
  } catch {
    return [];
  }
}

export async function apiCreateRestaurant(payload: {
  name: string;
  open_time: string;
  close_time: string;
  latitude: number;
  longitude: number;
}): Promise<{ success: boolean; message: string; restaurant?: OwnerRestaurant }> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BACKEND_URL}/owner/restaurants`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create restaurant");
  }
  return data;
}

export async function apiDeleteRestaurant(restaurantId: string): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BACKEND_URL}/owner/restaurants/${restaurantId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete restaurant");
  }
  return data;
}

export async function apiGetAdminPendingOwners(): Promise<any[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BACKEND_URL}/admin/pending_owners`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    return data.success && Array.isArray(data.owners) ? data.owners : [];
  } catch {
    return [];
  }
}

export async function apiVerifyOwner(ownerId: string, status: "approved" | "rejected"): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Admin authorization required");

  const res = await fetch(`${BACKEND_URL}/admin/verify_owner`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ owner_id: ownerId, status })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to verify owner");
  }
  return data;
}

export async function apiGetAdminPendingRestaurants(): Promise<any[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BACKEND_URL}/admin/pending_restaurants`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    return data.success && Array.isArray(data.restaurants) ? data.restaurants : [];
  } catch {
    return [];
  }
}

export async function apiVerifyRestaurant(restaurantId: string, status: "open" | "rejected" | "closed"): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Admin authorization required");

  const res = await fetch(`${BACKEND_URL}/admin/verify_restaurant`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ restaurant_id: restaurantId, status })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to verify restaurant");
  }
  return data;
}

export type AdminUserRow = {
  username: string;
  name: string;
  email: string;
  phone: string;
  balance: string | number;
  status: string;
};

export async function apiGetAdminUsers(): Promise<AdminUserRow[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    return data.success && Array.isArray(data.users) ? data.users : [];
  } catch {
    return [];
  }
}
