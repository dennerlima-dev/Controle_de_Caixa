import { Navigate } from "react-router"

export function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}