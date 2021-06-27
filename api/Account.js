//Import Statements
const express = require('express')
const { check, validationResult } = require('express-validator')
const securePassword = require('../functions/SecurePassword')
const comparePassword = require('../functions/ComparePassword')
const auth = require('../middleware/auth')
const User = require('../model/User')
const Prototype = require('../model/Prototype')
const router = express.Router()

//Dashboard Route
router.get
(
    '/dashboard', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const user = await User.findById(req.id).select("-password")
        
            if(user)
            {
                const prototypeCount= await Prototype.find({ creator: req.id }).countDocuments()
                return res.status(200).json({ user, prototypeCount })
            }

            else
            {
                return res.status(401).json({ msg: 'Unauthorized' })
            }
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server Error' })
        }
    }
)

//Update Account Route
router.post
(
    '/update', 

    auth, 

    [
        check('name', 'Name is required').notEmpty(),
        check('password', 'Password must be within 8 & 18 chars').isLength(8,18)
    ],

    async(req,res)=> 
    {
        const errors = validationResult(req)

        if(!errors.isEmpty())
        {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else
        {
            let { name, password } = req.body
            password = securePassword(password)
            
            try
            {
                await User.findByIdAndUpdate(req.id, { name, password })
                return res.status(200).json({ msg: 'Profile Updated' })
            }
            
            catch(error)
            {
                return res.status(500).json({ msg: 'Server Error' })
            }
        }
    }
)

//Close Account Route
router.post
(
    '/close', 

    auth, 

    async(req,res)=> 
    {
        let { password } = req.body
        const user = await User.findById(req.id)

        if(user)
        {
            const isPasswordMatching = await comparePassword(password, user.password)
            
            if(isPasswordMatching)
            {
                await Prototype.deleteMany({ creator: req.id })
                await User.findByIdAndDelete(req.id)
                return res.status(200).json({ msg: 'Account Close Success' })
            }

            else
            {
                return res.status(401).json({ msg: 'Invalid Password' })
            }
        }

        else
        {
            return res.status(401).json({ msg: 'Invalid Password' })
        }
    }
)

//Export Statement
module.exports = router