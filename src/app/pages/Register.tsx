import { useState } from "react"
import { Link } from "react-router"
import { apiFetch } from "../../api/api"

export function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("cliente")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleRegister() {
    try {
      const res = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess("Usuário cadastrado com sucesso! Faça login.")
        setName("")
        setEmail("")
        setPassword("")
      } else {
        setError(data.message || "Erro no cadastro")
      }
    } catch {
      setError("Erro ao conectar com servidor")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">
          Cadastro
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="caixa">Caixa</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          Cadastrar
        </button>

        <p className="text-center">
          Já tem conta? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  )
}