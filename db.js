import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'mysql-marvinmbuni.alwaysdata.net',
  user: 'marvinmbuni',
  password: 'modcom2026',
  database: 'marvinmbuni_appliances',
  port: 3306
})

db.connect((err) => {
  if (err) {
    console.log('DB Error:', err)
  } else {
    console.log('Database connected successfully')
  }
})

export default db