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
  name TEXT UNIQUE,
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
  stock INTEGER,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
)
`)

// Atualiza tabela antiga caso não exista user_id
pool.query(`
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
`)
// Criar usuário admin se não existir (nome admin, email admin)
pool.query(`
INSERT INTO users (name, email, password, role) 
VALUES ('admin', 'admin@admin.local', 'aguaesal06', 'admin')
ON CONFLICT (name) DO UPDATE SET email = 'admin@admin.local', password = 'aguaesal06', role = 'admin'
`)

// Ajustar produtos globais antigos para pertencer ao admin (se ainda não tinham user_id)
pool.query(`
UPDATE products
SET user_id = (SELECT id FROM users WHERE name = 'admin' LIMIT 1)
WHERE user_id IS NULL
`)

// STRICT auth middleware - rejeita qualquer coisa sem token válido
async function getUserById(userId) {
  const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId])
  return userRes.rows[0]
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    console.warn('[AUTH DENIED] No token provided')
    return res.status(401).json({ message: "Unauthorized - sem token" })
  }

  // Validate token format (bearer or direto)
  const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token
  if (bearerToken !== "123456") {
    console.warn('[AUTH DENIED] Invalid token:', bearerToken)
    return res.status(403).json({ message: "Unauthorized - token inválido" })
  }

  const userId = Number(req.headers['x-user-id'])
  if (!userId || Number.isNaN(userId)) {
    console.warn('[AUTH DENIED] Missing or invalid user id in X-User-Id header')
    return res.status(401).json({ message: "Unauthorized - sem usuário" })
  }

  req.userId = userId
  next()
}

function isAdmin(user) {
  return user && user.role === 'admin'
}

// Health check endpoint (public)
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// Validate token endpoint (protected) - used by frontend
app.get("/auth/validate", authMiddleware, async (req, res) => {
  const user = await getUserById(req.userId)
  if (!user) {
    return res.status(401).json({ message: 'Usuário inválido' })
  }
  res.json({ valid: true, user, timestamp: new Date().toISOString() })
})

// GET
app.get("/products", authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário inválido' })
    }

    let result
    if (isAdmin(user)) {
      result = await pool.query("SELECT * FROM products")
    } else {
      result = await pool.query("SELECT * FROM products WHERE user_id = $1", [req.userId])
    }
    res.json(result.rows)
  } catch (error) {
    console.error('Erro GET /products', error)
    res.status(500).json({ message: 'Erro ao buscar produtos' })
  }
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
      const user = await getUserById(req.userId)
      if (!user || !isAdmin(user)) {
        return res.status(403).json({ success: false, message: 'Apenas admin pode restaurar produtos padrão' })
      }

      await pool.query('DELETE FROM products');
      const results = [];
      for (const p of defaultProducts) {
        const r = await pool.query(
          "INSERT INTO products (name, price, stock, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
          [p.name, p.price, p.stock, user.id]
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
  try {
    const user = await getUserById(req.userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário inválido' })
    }

    const { name, price, stock } = req.body

    const result = await pool.query(
        "INSERT INTO products (name, price, stock, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, price, stock, user.id]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Erro POST /products', error)
    res.status(500).json({ message: 'Erro ao criar produto' })
  }
})

// PUT
app.put("/products/:id", authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário inválido' })
    }

    const { id } = req.params
    const { name, price, stock } = req.body

    const productToUpdate = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    if (productToUpdate.rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    if (!isAdmin(user) && productToUpdate.rows[0].user_id !== user.id) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *",
      [name, price, stock, id]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Erro PUT /products/:id', error)
    res.status(500).json({ message: 'Erro ao atualizar produto' })
  }
})

// DELETE
app.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário inválido' })
    }

    const { id } = req.params
    const productToDelete = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    if (productToDelete.rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    if (!isAdmin(user) && productToDelete.rows[0].user_id !== user.id) {
      return res.status(403).json({ message: "Acesso negado" })
    }

    await pool.query("DELETE FROM products WHERE id = $1", [id])
    res.json({ message: "Produto excluído com sucesso" })
  } catch (error) {
    console.error('Erro DELETE /products/:id', error)
    res.status(500).json({ message: 'Erro ao excluir produto' })
  }
})

app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !password || !email) {
    return res.status(400).json({ success: false, message: "Nome, email e senha são obrigatórios" })
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, password, role || 'cliente']
    )
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    console.error('Erro cadastro:', err)
    res.status(400).json({ success: false, message: "Nome ou email já existe ou erro no cadastro" })
  }
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Usuário e senha são obrigatórios" })
  }

  try {
    // Login por nome de usuário (case-insensitive)
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(name) = LOWER($1) AND password = $2",
      [username, password]
    )

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