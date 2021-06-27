//Import Statements
const bcrypt = require('bcryptjs')

//Secure Password function
const securePassword = async(password) =>
{
    try 
    {
        const hashedPassword = await bcrypt.hash(password, 12)
        return hashedPassword
    } 
    
    catch (error) 
    {
        throw error
    }
}

//Export Statement
module.exports = securePassword