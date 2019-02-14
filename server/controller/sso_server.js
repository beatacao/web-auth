var client_token_secret = 'client_token_secret'

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
    }
}