import { DEMO_MODE } from './config'

const API_URL = import.meta.env.VITE_API_URL;

export async function getCategories() {

  if (DEMO_MODE) {
    return [
      { id: "1", name: "Anéis" },
      { id: "2", name: "Colares" },
      { id: "3", name: "Brincos" }
    ]
  }

  const response = await fetch(`${API_URL}/categories`);
  return response.json();
}

export async function createCategory(category: any) {

  if (DEMO_MODE) {
    console.log("Categoria criada (DEMO):", category)
    return { success: true, id: Date.now().toString() }
  }

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

  if (DEMO_MODE) {
    console.log("Categoria atualizada (DEMO):", id, category)
    return { success: true }
  }

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

  if (DEMO_MODE) {
    console.log("Categoria deletada (DEMO):", id)
    return
  }

  await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
}