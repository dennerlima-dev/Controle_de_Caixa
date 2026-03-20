export function apiFetch(url: string, options: any = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token") || "",
      ...(options.headers || {})
    }
  })
}