const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(cookieParser())
const port = process.env.port || 8888
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect()
initRoutes(app)
app.listen(port, () => {
    console.log('Server running on the port :' + port)
})
