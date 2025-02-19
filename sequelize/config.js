const { Sequelize } = require("sequelize");
require("dotenv").config()

//mysql://root:vukZfdyNKLzCIKKzZjRsgsqKnfKdQPZn@gondola.proxy.rlwy.net:36231/railway
// no dotenv

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
    },
  }
);

module.exports = sequelize;