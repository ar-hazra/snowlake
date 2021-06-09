//Import Statements
const express = require('express')
const jwt = require('jsonwebtoken')
const otpGen  = require("otp-generator")
const otpTool = require("otp-without-db")
const sha256 = require('sha256')
const { check, validationResult } = require('express-validator')
const User = require('../model/User')
const sendMail = require('../functions/SendMail')
const router = express.Router()
require('dotenv').config()

//Reading Environment Variables
const OTP_KEY = process.env.OTP_KEY
const JWT_SECRET = process.env.JWT_SECRET

//Sign Up Route - Get OTP
router.post
(
    '/signup/getotp', 

    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').not().isEmpty()
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
            const { email } = req.body
            
            try 
            {
                let user = await User.findOne({ email })

                if(user)
                {
                    return res.status(400).json({ msg: 'Account With Same Email Address Exists' })
                }

                else
                {
                    let otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false })
                    let hash = otpTool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm="sha256")
                    let subject = 'Snowlake Team'
                    let content = `${ otp } is your verification code for Snowlake. Valid for 3 minutes.`
                    sendMail(email, subject, content)
                    return res.status(200).json({ hash, msg: 'Please check OTP in Email' })
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Sign Up Route - Register
router.post
(
    '/signup/register', 

    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').not().isEmpty(),
        check('password', 'Password must be within 8 & 18 chars').isLength({ min:8, max:18 }),
        check('otp', 'OTP must be a 6 digit number').isLength({ min:6, max:6 })
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
            let { name, email, password, otp, hash } = req.body
            password = sha256.x2(password)

            try 
            {
                let user = await User.findOne({ email })

                if(user)
                {
                    return res.status(400).json({ msg: 'Account With Same Email Address Exists' })
                }

                else
                {
                    const isOTPValid = otpTool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm="sha256")

                    if(isOTPValid)
                    {
                        user = new User({ name, email, password })
                        await user.save()
                        const payload = { id: user.id }
                        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 })
                        return res.status(200).json({ token })
                    }

                    else
                    {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }

                }        
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Sign In Route - Get OTP
router.post
(
    '/signin/getotp', 

    [
        check('email', 'Email is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
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
            let { email, password } = req.body
            password = sha256.x2(password)

            try 
            {
                let user = await User.findOne({ email, password })

                if(!user)
                {
                    return res.status(401).json({ msg: 'Invalid Credentials' })
                }

                else
                {
                    let otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false })
                    let hash = otpTool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm="sha256")
                    let subject = 'Snowlake Team'
                    let content = `${ otp } is your verification code for Snowlake. Valid for 3 minutes.`
                    sendMail(email, subject, content)
                    return res.status(200).json({ hash, msg: 'Please check OTP in Email' })
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Sign In Route - Login
router.post
(
    '/signin/login',

    [
        check('email', 'Email is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        check('otp', 'OTP must be a 6 digit number').isLength({ min:6, max:6 })
    ],

    async(req, res) =>
    {
        const errors = validationResult(req)
        
        if(!errors.isEmpty())
        {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else
        {
            let { email, password, otp, hash } = req.body
            password = sha256.x2(password)

            try 
            {
                let user = await User.findOne({ email, password })

                if(!user)
                {
                    return res.status(401).json({ msg: 'Invalid Credentials' })
                }

                else
                {
                    const isOTPValid = otpTool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm="sha256")
                    
                    if(isOTPValid)
                    {
                        const payload = { id: user.id }
                        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 })
                        return res.status(200).json({ token })
                    }

                    else
                    {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }
                }
            } 
            
            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Password Reset Route - Get OTP
router.post
(
    '/pwreset/getotp',

    [
        check('email', 'Email is required').not().isEmpty(),
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
            const { email } = req.body
            
            try 
            {
                let user = await User.findOne({ email })

                if(!user)
                {
                    return res.status(400).json({ msg: 'Account does not exist' })
                }

                else
                {
                    let otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false })
                    let hash = otpTool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm="sha256")
                    let subject = 'Snowlake Team'
                    let content = `${ otp } is your verification code for Snowlake. Valid for 3 minutes.`
                    sendMail(email, subject, content)
                    return res.status(200).json({ hash, msg: 'Please check OTP in Email' })
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Password Reset Route - Reset
router.post
(
    '/pwreset/reset', 

    [
        check('email', 'Email is required').not().isEmpty(),
        check('password', 'Password must be within 8 & 18 chars').isLength({ min:8, max:18 }),
        check('otp', 'OTP must be a 6 digit number').isLength({ min:6, max:6 })
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
            let { email, password, otp, hash } = req.body
            password = sha256.x2(password)
            
            try 
            {
                let user = await User.findOne({ email })

                if(!user)
                {
                    return res.status(400).json({ msg: 'Account Does Not Exist' })
                }

                else
                {
                    const isOTPValid = otpTool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm="sha256")

                    if(isOTPValid)
                    {
                        const filter = { email: email }
                        const update = { password: password }
                        await User.findOneAndUpdate(filter, update)
                        return res.status(200).json({ msg: 'Password Reset Success' })
                    }

                    else
                    {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }  
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Export Statement
module.exports = router