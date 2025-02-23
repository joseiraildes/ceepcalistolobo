const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "images/")
  },
  filename: (req, file, cb)=>{
    const fileExt = file.originalname.split(".")[1]

    const newFileName = require("crypto")
      .randomBytes(64)
      .toString("hex")

    cb(null, `${newFileName}.${fileExt}`)
  }
})

const upload = multer({ storage })

module.exports = upload