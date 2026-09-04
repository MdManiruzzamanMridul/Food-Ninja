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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

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
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Backend server is offline or unreachable. Please ensure 'python app.py' is running in D:\\project\\Food-Ninja\\Backend."
    );
  }

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
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Cannot connect to the Flask Backend. Please ensure 'python app.py' is running on http://127.0.0.1:5000 in your Backend terminal."
    );
  }

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

export async function apiGetLocation(): Promise<{
  success: boolean;
  has_location: boolean;
  latitude: number | null;
  longitude: number | null;
}> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required. Please log in.");

  const res = await fetch(`${BACKEND_URL}/users/me/location`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch location");
  return data;
}

export async function apiGetRiderStatus(): Promise<{ success: boolean; status: string; has_location: boolean }> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BACKEND_URL}/rider/status`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch rider status");
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

export async function apiGetAdminStatus(): Promise<{ success: boolean; status: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BACKEND_URL}/admin/status`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch admin status");
  return data;
}

export type AdminApprovalRow = {
  username: string;
  email: string;
  phone: string;
  status: string;
};

export async function apiGetPendingAdmins(): Promise<AdminApprovalRow[]> {
  const token = getAuthToken();
  if (!token) return [];
  const res = await fetch(`${BACKEND_URL}/admin/pending_admins`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch admins");
  return Array.isArray(data.admins) ? data.admins : [];
}

export async function apiVerifyAdmin(username: string, status: "approved" | "banned" | "pending"): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Admin authorization required");
  const res = await fetch(`${BACKEND_URL}/admin/verify_admin`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to verify admin");
  return data;
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

export async function apiVerifyRestaurant(restaurantId: string, status: "closed" | "banned" | "pending"): Promise<{ success: boolean; message: string }> {
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

export type AdminRiderRow = {
  username: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: string;
};

export async function apiGetAdminPendingRiders(): Promise<AdminRiderRow[]> {
  const token = getAuthToken();
  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/admin/pending_riders`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch riders");
  return Array.isArray(data.riders) ? data.riders : [];
}

export async function apiVerifyRider(riderUsername: string, status: "offline" | "banned" | "pending"): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) throw new Error("Admin authorization required");

  const res = await fetch(`${BACKEND_URL}/admin/verify_rider`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rider_username: riderUsername, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to verify rider");
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
