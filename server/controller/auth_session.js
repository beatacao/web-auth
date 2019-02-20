var service_user = require('../service/users')

module.exports = {
    session: function(req, res, next){
        if(!req.session.user){
            res.redirect('login?service=http://' + req.headers.host  + req.url)
        }
        next()
    },
    sessionGenerate(req, res, next){
        var user = service_user.getUsers(req.body.username) 
        req.session.user = user
    }
}