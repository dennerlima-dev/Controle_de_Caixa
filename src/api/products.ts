import { apiFetch } from './api'

export async function getProducts() {
  const response = await apiFetch("/products")
  const data = await response.json()
  return data
}

export async function createProduct(product: { name: string; price: number; stock: number }) {
  const response = await apiFetch("/products", {
    method: 'POST',
    body: JSON.stringify(product)
  })
  const data = await response.json()
  return data
}

export async function updateProduct(id: string, product: Partial<{ name: string; price: number; stock: number }>) {
  const response = await apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  })
  const data = await response.json()
  return data
}

export async function deleteProduct(id: string) {
  await apiFetch(`/products/${id}`, {
    method: 'DELETE'
  })
}