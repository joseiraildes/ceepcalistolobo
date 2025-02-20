const mysql = require("mysql2")

async function MySql() {
  try {
    // create a new connection
    const connection = mysql.createPool({
      // host: process.env.DB_HOST,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      // port: process.env.DB_PORT
      uri: "mysql://root:vukZfdyNKLzCIKKzZjRsgsqKnfKdQPZn@gondola.proxy.rlwy.net:36231/railway"
    })

    const pool = await connection.promise()

    return pool

  } catch (error) {
    console.error("Error connecting to the database:", error)
  }
}


module.exports = MySql