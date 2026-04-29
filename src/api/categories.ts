const API_URL = import.meta.env.VITE_API_URL;

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
}

export async function createCategory(category: any) {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  return response.json();
}

export async function updateCategoryAPI(id: string, category: any) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  return response.json();
}

export async function deleteCategoryAPI(id: string) {
  await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
}