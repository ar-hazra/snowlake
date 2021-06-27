//Import Statements
const bcrypt = require('bcryptjs')

//Compare Password function
const comparePassword = async(userPassword, dbPassword) =>
{
    try 
    {
        const isCorrect = await bcrypt.compare(userPassword, dbPassword)
        return isCorrect
    } 
    
    catch (error) 
    {
        throw error
    }
}

//Export Statement
module.exports = comparePassword