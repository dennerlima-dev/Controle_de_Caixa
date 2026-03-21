const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function getApiUrl() {
  return API_URL
}

export function apiFetch(url: string, options: any = {}) {
  const token = localStorage.getItem("token") || ""
  const userId = localStorage.getItem("userId") || ""

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      // 🔥 CORREÇÃO 1: Bearer
      Authorization: token ? `Bearer ${token}` : "",

      // 🔥 CORREÇÃO 2: userId direto
      "X-User-Id": userId,

      ...(options.headers || {})
    }
  })
}