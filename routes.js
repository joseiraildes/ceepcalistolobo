require("dotenv").config()
const express = require("express")
const app = require("./config/config.js")
const { engine } = require("express-handlebars")
const path = require("path")
const sequelize = require("./sequelize/config.js")
const Ip = require("./infra/ip.js")
const MySql = require("./database/config.js")
const User = require("./models/Users.js")


app.use(express.json())
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.use(express.static(path.join(__dirname + "/static")))

app.get("/", async(req, res)=>{
  const mysql = await MySql()
  const ip = await Ip()

  try {
    const user = await User.findOne({
      where: {
        ip: ip
      }
    })
    if(user===null){
      res.redirect("/login")

      console.log({
        message: "User not found",
        error: "User not exists",
        redirecting: "/login"
      })
    }else{
      res.render("home", {
        userName: user["nome"]
      })
      // success message
      console.log({
        message: "Successiful",
        userName: user["nome"]
      })

      // console.log({
      //   message: "Successiful",
      //   userName: user["nome"]
      // })
    }
  }catch(error){
    console.error("Error fetching user:", error)
    res.status(500).json({
      message: "Error fetching user",
      error: error
    })
  }

})

app.get("/login", async(req, res)=>{
  const ip = await Ip()
  try{
    const user = await User.findOne({
      where: {
        ip: ip
      }
    })
    if(user === null){
      res.render("login")
    }else{
      res.redirect("/")
      console.log({
        message: "User already exists",
        userName: user["nome"]
      })
    }
  }catch(error){
    console.error("Error fetching user:", error)
    res.status(500).json({
      message: "Error fetching user",
      error: error
    })
  }
})
