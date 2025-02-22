const moment = require("moment")
moment.locale("pt-br")

const now =  moment()
const date = now.format("LLLL")


module.exports = date