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

// STRICT auth middleware - rejeita qualquer coisa sem token válido
function authMiddleware(req, res, next) {
  const token = req.headers.authorization
  
  if (!token) {
    console.warn('[AUTH DENIED] No token provided')
    return res.status(401).json({ message: "Unauthorized - sem token" })
  }

  // Validate token format (bearer or direct)
  const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token
  
  if (bearerToken !== "123456") {
    console.warn('[AUTH DENIED] Invalid token:', bearerToken)
    return res.status(403).json({ message: "Unauthorized - token inválido" })
  }

  next()
}

// Health check endpoint (public)
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// Validate token endpoint (protected) - used by frontend
app.get("/auth/validate", authMiddleware, (req, res) => {
  res.json({ valid: true, timestamp: new Date().toISOString() })
})

// GET
app.get("/products", authMiddleware, async (req, res) => {
    const result = await pool.query("SELECT * FROM products")
    res.json(result.rows)
})

// SEED or restore default products
app.post("/products/seed", authMiddleware, async (req, res) => {
    const defaultProducts = [
      { name: 'Anel Solitário Prata 925', price: 150.00, stock: 5 },
      { name: 'Brinco Argola Média', price: 120.00, stock: 8 },
      { name: 'Colar Coração', price: 180.00, stock: 3 },
      { name: 'Pulseira Veneziana', price: 250.00, stock: 4 }
    ];

    try {
      await pool.query('DELETE FROM products');
      const results = [];
      for (const p of defaultProducts) {
        const r = await pool.query(
          "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
          [p.name, p.price, p.stock]
        );
        results.push(r.rows[0]);
      }
      res.json({ success: true, products: results });
    } catch (error) {
      console.error('Error seeding products', error);
      res.status(500).json({ success: false, message: 'Erro ao restaurar produtos' });
    }
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

// PUT
app.put("/products/:id", authMiddleware, async (req, res) => {
    const { id } = req.params
    const { name, price, stock } = req.body

    const result = await pool.query(
        "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *",
        [name, price, stock, id]
    )

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" })
    }

    res.json(result.rows[0])
})

// DELETE
app.delete("/products/:id", authMiddleware, async (req, res) => {
    const { id } = req.params

    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" })
    }

    res.json({ message: "Produto excluído com sucesso" })
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

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [username, password])
    if (result.rows.length > 0) {
      console.log('[AUTH SUCCESS] User logged in:', username)
      return res.json({ success: true, token: "123456", user: result.rows[0] })
    }
  } catch (err) {
    console.error("DB error:", err)
  }

  console.warn('[AUTH FAILED] Invalid credentials:', username)
  res.status(401).json({ success: false, message: "Credenciais inválidas" })
})

app.listen(3000, () => {
console.log("Servidor rodando em porta 3000")
})