const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')

const app = express()
const port = process.env.port || 8888
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect()
initRoutes(app)
app.listen(port,() => {
    console.log('Sever running on the port :' +port)
})