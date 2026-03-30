type JsonBody = Record<string, unknown>;

async function request(
  url: string,
  method: string,
  body?: JsonBody,
): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Request failed");
  }
}

// ─── Typed resource helpers ──────────────────────────────────────────────────

export const api = {
  /** Create a new resource (POST). */
  create: (resource: string, body: JsonBody) =>
    request(`/api/${resource}`, "POST", body),

  /** Update an existing resource (PUT). */
  update: (resource: string, id: number | string, body: JsonBody) =>
    request(`/api/${resource}/${id}`, "PUT", body),

  /** Delete a resource (DELETE). */
  remove: (resource: string, id: number | string) =>
    request(`/api/${resource}/${id}`, "DELETE"),
};
