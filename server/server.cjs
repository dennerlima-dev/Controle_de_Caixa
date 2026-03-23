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

// GET
app.get("/products", async (req, res) => {
    const result = await pool.query("SELECT * FROM products")
    res.json(result.rows)
})

// POST
app.post("/products", async (req, res) => {
    const { name, price, stock } = req.body

    const result = await pool.query(
        "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
        [name, price, stock]
    )

    res.json(result.rows[0])
})

// UPDATE PRODUTOS
app.put("/products/:id", async (req, res) => {
    const { id } = req.params
    const { name, price, stock } = req.body

    const result = await pool.query(
        "UPDATE products SET name=$1, price=$2, stock=$3 WHERE id=$4 RETURNING *",
        [name, price, stock, id]
    )

    res.json(result.rows[0])
})


app.listen(3000, () => {
console.log("Servidor rodando")
})