import { Navigate } from "react-router"
import { useApp } from "../context"

export function ProtectedRoute({ children }: any) {
  const { currentUser } = useApp()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}