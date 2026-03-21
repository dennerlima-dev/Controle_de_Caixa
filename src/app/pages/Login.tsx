import { useState } from "react"
import { Link } from "react-router"
import { apiFetch } from "../../api/api"

export function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin() {
    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (data.token) {
        localStorage.setItem("token", data.token)

        // SALVA DADOS SEPARADOS
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userName", data.user.name)
        localStorage.setItem("userRole", data.user.role)
        
        window.location.href = "/"
      } else {
        setError("Usuário ou senha inválidos")
      }

    } catch {
      setError("Erro ao conectar com servidor")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>

        <p className="text-center mt-4">
          Não tem conta? <Link to="/register" className="text-blue-500 hover:underline">Cadastrar</Link>
        </p>

      </div>
    </div>
  )
}