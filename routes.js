require("dotenv").config()
const express = require("express")
const app = require("./config/config.js")
const { engine } = require("express-handlebars")
const path = require("path")
const sequelize = require("./sequelize/config.js")
const Ip = require("./infra/ip.js")


app.use(express.json())
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.use(express.static(path.join(__dirname + "/static")))

app.get("/", async(req, res)=>{
  res.render("home")
})