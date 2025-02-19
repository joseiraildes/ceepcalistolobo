const app = require("./config/config.js")
require("dotenv").config()
require("./routes.js")

app.listen(process.env.PORT, (err)=>{
  if(err) console.log(err)
  console.log({
    message: "Server is running on port " + process.env.PORT})
})