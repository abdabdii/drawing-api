const jwt = require('jsonwebtoken')
const {pubKey} = require('./getKeyPair')


const Authenticate = (req , res , next) => {
    const token =  getToken(req)

    if (token){
        const decodedToken = isAuthed(token)

        res.locals.user = decodedToken.sub
        next()
    }else{
       res.status(401).json({
           error:"Invalid Token"
       })
    }
   
}
const getToken = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }


const isAuthed = (token) => {
    const decodedToken = jwt.verify(token,pubKey , {algorithm: 'RS256'})
    
    if (decodedToken) {
        return decodedToken
    }else{
        return null
    }
}
  
module.exports = {
    Authenticate
}