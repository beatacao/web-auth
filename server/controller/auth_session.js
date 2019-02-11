var service_user = require('../service/users')

module.exports = {
    session: function(req, res, next){
        if(!req.session.user){
            res.render('login', {error: null})
        }
        next()
    },
    sessionGenerate(req, res, next){
        var user = service_user.getUsers(req.body.username) 
        req.session.user = user
    }
}