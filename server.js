import express from 'express'
import db from './db.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/add-appliance', (req, res) => {
  const {
    name,
    brand,
    powerrating,
    category,
    weight,
    price,
    stock,
    warranty,
    photo
  } = req.body

  const sql = `
    INSERT INTO appliances 
    (name, brand, powerrating, category, weight, price, stock, warranty, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [name, brand, powerrating, category, weight, price, stock, warranty, photo],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.json({ error: err })
      }
      res.json({ message: 'Appliance added successfully' })
    }
  )
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})