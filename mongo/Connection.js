//Import Statements
const mongoose = require('mongoose')
require('dotenv').config()

//Reading Environment Variables
const MONGO_URI = process.env.MONGO_URI

//Mongo DB Connection Method
const Connection = async() =>
{
    try 
    {
        await mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
        console.log('Mongo DB Connected')
    } 
    
    catch (error) 
    {
        console.log(error)
    }
}

//Export Statement
module.exports = Connection