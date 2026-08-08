export type BackendMode = "live" | "demo";

export type BackendResponse<T> = {
  ok: boolean;
  mode: BackendMode;
  endpoint: string;
  data: T;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

function resolveUrl(endpoint: string) {
  if (!apiBaseUrl) {
    return endpoint;
  }

  return `${apiBaseUrl.replace(/\/$/, "")}${endpoint}`;
}

export async function submitPlatformRequest<T>(
  endpoint: string,
  payload: Record<string, unknown> = {},
): Promise<BackendResponse<T>> {
  // When the backend contract is ready, set NEXT_PUBLIC_API_BASE_URL and
  // the UI will start sending real requests without changing any page code.
  if (!apiBaseUrl) {
    return {
      ok: true,
      mode: "demo",
      endpoint,
      data: payload as T,
    };
  }

  const response = await fetch(resolveUrl(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request to ${endpoint} failed with status ${response.status}`);
  }

  const data = (await response.json()) as T;

  return {
    ok: true,
    mode: "live",
    endpoint,
    data,
  };
}
