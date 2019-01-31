var service_user = require('../service/users')

module.exports = {
    basic: function(req, res, next, realm){
        var isAuthorized = false
        var authorization = req.headers.authorization
        if(authorization){
            var username, password
            var encode_basic = authorization.split(' ')[1]
            if(encode_basic){
                var decode_basic = new Buffer(encode_basic, 'base64').toString().split(':')
                username = decode_basic[0]
                password = decode_basic[1]
            }
            var user = service_user.getUsers(username)
            if(user.name === username && user.password === password){
                isAuthorized = true
            }
        }
        if(!isAuthorized){
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="'+ realm || req.path +'"');
            res.end()
        }
        next()
    }
}