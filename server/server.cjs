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

// CRIAR TABELA
pool.query(`
CREATE TABLE IF NOT EXISTS products (
id SERIAL PRIMARY KEY,
name TEXT,
price REAL,
stock INTEGER
)
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


app.listen(3000, () => {
console.log("Servidor rodando")
})

app.post("/login", (req, res) => {
  const { username, password } = req.body

  if (username === "admin" && password === "aguaesal06") {
    return res.json({ success: true, token: "123456" })
  }

  res.status(401).json({ success: false, message: "Credenciais inválidas" })
})