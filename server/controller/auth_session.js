var service_user = require('../service/users')

module.exports = {
    session: function(req, res, next){
        if(!req.signedCookies['connect.sid'] || req.signedCookies['connect.sid'] !== req.sessionID ){
            res.render('login', {error: null})
        }
        next()
    },
    sessionGenerate(req, res, next){
        var user = service_user.getUsers(req.body.username) 
        return req.session.regenerate(function(err){
            if(err){
                return false
            }
            req.session.user = user
            
            return true
        })
    }
}