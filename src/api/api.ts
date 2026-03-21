const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function getApiUrl() {
  return API_URL
}

export function apiFetch(url: string, options: any = {}) {
  const token = localStorage.getItem("token") || ""
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "null") : null
  const userIdHeader = user?.id ? String(user.id) : ""

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      "X-User-Id": userIdHeader,
      ...(options.headers || {})
    }
  })
}