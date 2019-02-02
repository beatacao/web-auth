var jwt = require('jsonwebtoken')
var service_user = require('../service/users')
var secret = 'site_secret'

module.exports = {
    tokenVerify: function(req, res, next){
        console.log(req.signedCookies)
        if(!req.signedCookies['token']){
            res.render('login', {error: null})
            return
        }
        var token = req.signedCookies['token']
        jwt.verify(token, secret, function(err, decode){
            if(err){
                res.render('login', {error: null})
                return
            }
            next()
        })
    },
    tokenSign: function(req, res, next){
        var user = service_user.getUsers(req.body.username)  
        if(user.name === req.body.username && user.password === req.body.password){
            var token = jwt.sign(user, secret, {expiresIn: 60*10})
            res.cookie('token', token, {signed: true, maxAge: 1000*60*10})
        }
        return true
    }
}