const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {privKey} = require('../utils/getKeyPair')



//Post request to login the user

loginRouter.post('/' , async (req,res) =>{

    const {username,pass} = req.body

    //Check if username exists in database

    const user = await User.findOne({username})
    
    //Verify wether password is correct
    const verified =  user ? await bcrypt.compare(pass,user.password) : false
    
    if(!user ||!verified){
        
        return res.status(401).json({
            error:  'Invalid username or password'
        })
    }

    const userForToken = {
        sub:user._id
    }
    
    const token = jwt.sign(userForToken, privKey , {algorithm: 'RS256'})

    res
    .status(200)
    .send({ token,id: user.id, username: user.username, name: user.name, image:user.image })



})

module.exports = loginRouter