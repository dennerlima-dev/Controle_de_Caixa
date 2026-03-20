const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false}
})

// CRIAR TABELAS
pool.query(`
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name TEXT,
email TEXT UNIQUE,
password TEXT,
role TEXT DEFAULT 'cliente'
)
`)

pool.query(`
CREATE TABLE IF NOT EXISTS products (
id SERIAL PRIMARY KEY,
name TEXT,
price REAL,
stock INTEGER
)
`)

// Criar usuário admin se não existir
pool.query(`
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin', 'aguaesal06', 'admin')
ON CONFLICT (email) DO NOTHING
`)

function authMiddleware(req, res, next) {
  const token = req.headers.authorization

  if (token !== "123456") {
    return res.status(403).json({ message: "Não autorizado" })
  }

  next()
}

// GET
app.get("/products", authMiddleware, async (req, res) => {
    const result = await pool.query("SELECT * FROM products")
    res.json(result.rows)
})

// POST
app.post("/products", authMiddleware, async (req, res) => {
    const { name, price, stock } = req.body

    const result = await pool.query(
        "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
        [name, price, stock]
    )

    res.json(result.rows[0])
})


app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, password, role || 'cliente']
    )
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    res.status(400).json({ success: false, message: "Email já existe ou erro no cadastro" })
  }
})

app.listen(3000, () => {
console.log("Servidor rodando")
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [username, password])
    if (result.rows.length > 0) {
      return res.json({ success: true, token: "123456", user: result.rows[0] })
    }
  } catch (err) {
    console.error("DB error:", err)
  }

  res.status(401).json({ success: false, message: "Credenciais inválidas" })
})