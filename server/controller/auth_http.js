var service_user = require('../service/users')
var crypto = require('crypto')

var md5UsingCrypto = function(data){
    return crypto.createHash('md5').update(data, 'utf-8').digest('hex')
}

var getDigestInfo = function(auth){
    var digestInfo = auth.replace(/^Digest /, '')
    var digestObj = {}
    digestInfo.split(', ').forEach(function(item){
        var temp = item.split('=')
        digestObj[temp[0]] = (temp[0] === "qop" || temp[0] === 'nc') ? temp[1] : temp[1].substr(1, temp[1].length -2)
    })
    return digestObj
}

var realmConfig = {
    basic: '/docs',
    digest: '/articles'
}

module.exports = {
    basic: function(req, res, next){
        var isAuthorized = false
        var authorization = req.headers.authorization
        if(authorization && authorization.indexOf('Basic ') === 0){
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
            res.setHeader('WWW-Authenticate', 'Basic realm="'+ realmConfig.basic +'"');
            res.end()
        }
        next()
    },
    digest: function(req, res, next){
        var isAuthorized = false
        var authorization = req.headers.authorization
        if(authorization && authorization.indexOf('Digest ') === 0){
            var digestObj = getDigestInfo(authorization)
            var user = service_user.getUsers(digestObj.username)
            var digestAuthObj = {}
            var realm = realmConfig.digest

            digestAuthObj.ha1 = md5UsingCrypto(digestObj.username + ':' + realm + ':' + user.password);
            digestAuthObj.ha2 = md5UsingCrypto(req.method + ':' + digestObj.uri);
        
            var resp = md5UsingCrypto([digestAuthObj.ha1, digestObj.nonce, digestObj.nc, digestObj.cnonce, digestObj.qop, digestAuthObj.ha2].join(':'));
                    
            digestAuthObj.response = resp;

            if (digestObj.response === digestAuthObj.response) {
                isAuthorized = true
            }
        }
        if(!isAuthorized){
            var nonce = md5UsingCrypto(Math.random() + req.path)
            var opaque = md5UsingCrypto(req.path)
            realmConfig.digest = realmConfig.digest.length>0 ? realmConfig.digest : req.path
            res.statusCode = 401
            res.setHeader('WWW-Authenticate', 'Digest realm="' + realmConfig.digest + '", qop="auth", nonce="' + nonce + '", opaque="' + opaque + '"')
            res.end();
        }
        next()
    }
}