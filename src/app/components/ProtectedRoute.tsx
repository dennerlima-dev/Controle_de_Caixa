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
        // Validate token with backend auth endpoint
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const response = await fetch(`${apiUrl}/auth/validate`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          credentials: 'omit'
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else if (response.status === 401 || response.status === 403) {
          // Token invalid or expired
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("joalheria-data")
          setIsAuthenticated(false)
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("joalheria-data")
          setIsAuthenticated(false)
        }
      } catch (error) {
        // Network error = DENY ACCESS (security first)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("joalheria-data")
        setIsAuthenticated(false)
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