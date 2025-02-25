require("dotenv").config()
const express = require("express")
const app = require("./config/config.js")
const { engine } = require("express-handlebars")
const path = require("path")
const sequelize = require("./sequelize/config.js")
const Ip = require("./infra/ip.js")
const MySql = require("./database/config.js")
const User = require("./models/Users.js")
const formatName = require("./funcs/formating.js")
const { marked } = require("marked")
const date = require("./moment/date.js")
const upload = require("./upload/files.js")
const Post = require("./models/Posts.js")
const Comment = require("./models/Comment.js")


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.use(express.static(path.join(__dirname + "/static")))
app.use(express.static(path.join(__dirname + "/images")))
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

app.post("/login", async(req, res)=>{
  const ip = await Ip()
  const { email, senha } = req.body

  try{
    const user = await User.findOne({
      where: {
        email,
        senha
      }
    })
    if(user === null){
      res.render("login", {
        notify: `
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
            <h2>
              <strong>
                Aviso!!
              </strong>
            </h2>
            <hr>
            <span>E-mail ou senha inválidos! Por favor, insira dados válidos para poder entrar no sistema.</span>
            <br>
          </div>
          <br>
        `
      })
      console.log({
        message: "Credenciais inválidas"
      })
    }else{

      const userUpdate = await User.update({
        ip
      }, {
        where: {
          email,
          senha
        }
      })

      console.log({
        message: "Success",
        userUpdate
      })

      res.redirect('/')
    }
  }catch(error){
    console.error("Error fetching user:", error)
    res.status(500).json({
      message: "Error fetching user",
      error: error
    })
  }
})
app.get("/cadastro", async(req, res)=>{
  const ip = await Ip()
  
  try{
    const user = await User.findOne({
      where: {
        ip
      }
    })

    if(user === null){
      res.render("cadastro")
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
app.post("/cadastro", async(req, res)=>{
  const ip = await Ip()
  const { email, senha, curso, status, data_nasc } = req.body
  const nome = formatName(req.body.nome)
  
  try{
    const user = await User.findOne({
      where: {
        email,
        nome
      }
    })

    if(user === null){
      const userCreate = await User.create({
        nome,
        email,
        senha,
        bio: marked("Olá amigos"),
        curso,
        status,
        data_nasc,
        ip,
        data: date
      })

      console.log({
        message: "Success",
        userCreate
      })
      res.redirect('/')
    }else{
      res.render("cadastro", {
        notify: `
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
            <h2>
              <strong>
                Aviso!!
              </strong>
            </h2>
            <hr>
            <span>E-mail ou nome de usuário já cadastrados! Por favor, insira dados válidos para poder cadastrar-se.</span>
            <br>
          </div>
          <br>
        `
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
app.get("/publicar", async(req, res)=>{
  const ip = await Ip()

  try{
    const user = await User.findOne({
      where: {
        ip
      }
    })

    if(user === null){
      res.redirect("/login")
      console.log({
        message: "User not found",
        error: "User not exists",
        redirecting: "/login"
      })
    }else{
      res.render("publicar", {
        userName: user["nome"]
      })
      // success message
      console.log({
        message: "Successiful",
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

app.post("/publicar", upload.single("imagem"), async(req, res)=>{
  const ip = await Ip()
  const { titulo, conteudo } = req.body
  const file = req.file

  try{
    console.log({
      titulo,
      conteudo: marked(conteudo),
      file: file.filename
    })

    const user = await User.findOne({
      where: {
        ip
      }
    })

    if(user === null){
      res.redirect("/login")
      console.log({
        message: "User not found",
        error: "User not exists",
        redirecting: "/login"
      })
    }else{
      const post = await Post.create({
        nome: user["nome"],
        titulo,
        conteudo: marked(conteudo),
        imagem: file.filename,
        data: date,
        curso: user["curso"],
      })
      console.log({
        status: "OK",
        message: "Post created successfully",
      })

      res.redirect(`/@${post["nome"]}/${post["id"]}`)
    }
  }catch(error){
    console.error("Error processing post:", error)
    res.status(500).json({
      message: "Error processing post",
      error: error
    })
  }
})

app.get("/@:nome/:id", async(req, res)=>{
  const ip = await Ip()
  const { nome, id } = req.params
  const mysql = await MySql()
  try{
    const user = await User.findOne({
      where: {
        ip
      }
    })
    if(user === null){
      res.redirect("/login")
      console.log({
        message: "User not found",
        error: "User not exists",
        redirecting: "/login"
      })
    }else{
      const post = await Post.findOne({
        where: {
          id
        }
      })
      if(post === null){
        res.status(404).json({
          message: "Post not found",
        })
      }else{
        const [ postOne, rows ] = await mysql.query(`SELECT * FROM railway.posts WHERE id = '${id}' AND nome = '${nome}'`)
        const [ comments, rowsComment ] = await mysql.query(`SELECT * FROM comments WHERE post_id = '${id}'`)

        res.render("post", {
          userName: user["nome"],
          postOne,
          comments
        })
        console.log({
          message: "Successiful",
          userName: user["nome"],
          postTitle: post["titulo"]
        })
      }
    }
  }catch(error){
    console.error("Error fetching user or post:", error)
    res.status(500).json({
      message: "Error fetching user or post",
      error: error
    })
  }
})

// comment post

app.post("/@:nome/:id/comentar", async(req, res)=>{
  const ip = await Ip()
  const { nome, id } = req.params
  const { comentario } = req.body

  try{
    const user = await User.findOne({
      where: {
        ip
      }
    })
    if(user === null){
      res.redirect("/login")
      console.log({
        message: "User not found",
        error: "User not exists",
        redirecting: "/login"
      })
    }else{
      const post = await Post.findOne({
        where: {
          id
        }
      })
      if(post === null){
        res.status(404).json({
          message: "Post not found",
        })
      }else{
        const comment = await Comment.create({
          nome: user["nome"],
          comentario: marked(comentario),
          post_id: post["id"],
          data: date
        })
        console.log({
          message: "Comment created successfully",
          userName: user["nome"],
          postTitle: post["titulo"],
          comment_id: comment["id"]
        })

        res.redirect(`/@${post["nome"]}/${post["id"]}`)
      }
    }
  }catch(error){
    console.error("Error processing comment:", error)
    res.status(500).json({
      message: "Error processing comment",
      error: error
    })
  }
})
app.post("/@:nome/:id/curtir", async(req, res)=>{
  const ip = await Ip()
  const { nome, id } = req.params
  const mysql = await MySql()
  try{
    const user = await User.findOne({
      where: {
        ip
      }
    })
    if(user === null){
      res.redirect("/login")
      console.log({
        message: "User not found",
        error: "User not exists",
        redirecting: "/login"
      })
    }else{
      const post = await Post.findOne({
        where: {
          id
        }
      })
      if(post === null){
        res.status(404).json({
          message: "Post not found",
        })
      }else{
        const [ like, rows ] = await mysql.query(`
          UPDATE posts
          SET post_like = post_like + 1
          WHERE nome = '${nome}' AND id = '${id}'
        `)
        console.log({
          message: "Like created successfully",
          userName: user["nome"],
          postTitle: post["titulo"]
        })
        res.redirect(`/@${nome}/${id}`)
      }
    }
  }catch(error){
    console.error("Error processing like:", error)
    res.status(500).json({
      message: "Error processing like",
      error: error
    })
  }
})