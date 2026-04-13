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

// CRIAR TABELA PRODUTOS
pool.query(`
CREATE TABLE IF NOT EXISTS products (
id SERIAL PRIMARY KEY,
name TEXT,
price REAL,
stock INTEGER
)
`)

// CRIAR TABELA CATEGORIAS
pool.query(`
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
)
`)

// GET PRODUTOS
app.get("/products", async (req, res) => {
    const result = await pool.query("SELECT * FROM products")
    res.json(result.rows)
})

// GET CATEGORIAS
app.get("/categories", async (req, res) => {
  const result = await pool.query("SELECT * FROM categories");
  res.json(result.rows);
});

// POST PRODUTOS
app.post("/products", async (req, res) => {
    const { name, price, stock, category_id } = req.body

    const result = await pool.query(
        "INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, price, stock, category_id]
    )

    res.json(result.rows[0])
})

// POST CATEGORIAS
app.post("/categories", async (req, res) => {
  const { name, description } = req.body;

  const result = await pool.query(
    "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );

  res.json(result.rows[0]);
});

// PUT CATEGORIAS
app.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const result = await pool.query(
    "UPDATE categories SET name=$1, description=$2 WHERE id=$3 RETURNING *",
    [name, description, id]
  );

  res.json(result.rows[0]);
});

// DELETE CATEGORIAS
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM categories WHERE id=$1", [id]);

  res.json({ success: true });
});

// PUT PRODUTOS
app.put("/products/:id", async (req, res) => {
    const { id } = req.params
    const { name, price, stock, category_id } = req.body

    const result = await pool.query(
        "UPDATE products SET name=$1, price=$2, stock=$3, category_id=$4 WHERE id=$5 RETURNING *",
        [name, price, stock, category_id, id]
    )

    res.json(result.rows[0])
})


app.listen(3000, () => {
console.log("Servidor rodando")
})