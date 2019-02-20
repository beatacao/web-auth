var jwt = require('jsonwebtoken')
var service_user = require('../service/users')
var secret = 'site_secret'

module.exports = {
    tokenVerify: function(req, res, next){
        var authorization = req.headers.authorization
        var isAuthorized = false
        if(authorization && authorization.indexOf('Bearer ') === 0){
            var token = authorization.split(' ')[1]
            jwt.verify(token, secret, function(err, decode){
                if(err || !decode || !decode.isLogin){
                    isAuthorized = false
                }
                if(decode && decode.isLogin){
                    isAuthorized = true
                }
            })
        }
        return isAuthorized
    },
    tokenSign: function(req, res, next){
        var user = service_user.getUsers(req.body.username)  
        var token 
        if(user.name === req.body.username && user.password === req.body.password){
            token = jwt.sign({username: user.username, isLogin: true}, secret, {expiresIn: 60*10})
        }
        return token
    }
}