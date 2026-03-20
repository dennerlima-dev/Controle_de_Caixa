import { Navigate } from "react-router"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children }: any) {
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      if (!token || !user) {
        setIsAuthenticated(false)
        setIsValidating(false)
        return
      }

      try {
        // Validate token with backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/products`, {
          headers: {
            Authorization: token
          }
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          // Token is invalid, clear it
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setIsAuthenticated(false)
        }
      } catch (error) {
        // Network error, but if we have token and user, allow access
        // This handles offline scenarios
        setIsAuthenticated(true)
      }

      setIsValidating(false)
    }

    validateAuth()
  }, [])

  if (isValidating) {
    // Show loading while validating
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}