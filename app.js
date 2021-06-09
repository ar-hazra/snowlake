//Import Statements
const express = require('express')
const Connection = require('./mongo/Connection')
const path = require('path')
require('dotenv').config()

//Initialize Express Framework
const app = express()
app.listen(process.env.PORT || 7000)
app.use(express.json({ extended: false }))

//MongoDB Connection
Connection()

//Defining API Routes
app.use('/api/account', require('./api/Account'))
app.use('/api/auth', require('./api/Authentication'))
app.use('/api/prototype', require('./api/Prototype'))

//Production Build Combination with React
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('view/build'))
    app.get('*', (req,res) => { res.sendFile(path.resolve(__dirname, 'view', 'build', 'index.html')) })
}