const API_URL = import.meta.env.VITE_API_URL

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`)
  const data = await response.json()

  return data
}

export async function createProduct(product: any) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: product.name,
      price: product.salePrice,
      stock: product.stock,
    }),
  });

  return response.json();
}