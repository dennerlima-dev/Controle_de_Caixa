const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function getApiUrl() {
  return API_URL
}

export function apiFetch(url: string, options: any = {}) {
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token") || "",
      ...(options.headers || {})
    }
  })
}