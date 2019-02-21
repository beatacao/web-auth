var config = require('../config')
var client_token_secret = config.client_token_secret

module.exports = {
    verifytoken: function(req, res, next){
        var secret = req.headers.authorization && req.headers.authorization.split('Bearer ')[1]
        var token = req.query.token
        if(secret && (secret === client_token_secret)){
            return res.json({
                success: true,
                token: token
            })
        }
        return res.json({
            success: false,
            token: null
        })
    },
    verifyService: function(req, res, next){
        var service = req.query.service
        var isService = service && config.services.some(function(domain){
            return service.indexOf(domain) === 0
        })
        if(!service || isService){
            next()
        }else{
            res.end('该站点没有接入 sso-server!')
        }
        
    }
}