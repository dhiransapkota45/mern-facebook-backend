const express = require("express")
const app = express()
require('dotenv').config()
const connection = require("./database/connection")
const userRoute = require("./routes/userRoute")
const cors  =  require("cors")
const bodyParser = require("body-parser")

app.use(cors())
app.use(express.json())
app.use(express.static("public/profile_pic"))

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use("/user", userRoute)


app.listen(process.env.PORT, ()=>{
    console.log(`listening at server ${process.env.PORT}`)
    connection()
})
