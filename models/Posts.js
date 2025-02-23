const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize/config.js");

const Post = sequelize.define("posts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: false
  },
  post_like: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Post