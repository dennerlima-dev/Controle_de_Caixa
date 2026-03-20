const API_URL = import.meta.env.VITE_API_URL

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    headers: {
      Authorization: localStorage.getItem("token") || ""
    }
  })
  const data = await response.json()

  return data
}