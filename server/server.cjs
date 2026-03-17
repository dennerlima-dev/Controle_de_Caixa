const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./server/database.db")

db.run(`
CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
price REAL,
stock INTEGER
)
`)

app.get("/products", (req, res) => {
db.all("SELECT * FROM products", (err, rows) => {
res.json(rows)
})
})

app.post("/products", (req, res) => {
const { name, price, stock } = req.body

db.run(
"INSERT INTO products (name,price,stock) VALUES (?,?,?)",
[name, price, stock],
function () {
res.json({ id: this.lastID })
}
)
})

app.listen(3000, () => {
console.log("Servidor rodando na porta 3000")
})