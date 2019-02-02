module.exports = {
    session: function(req, res, next){
        if(!req.signedCookies['connect.sid'] || req.signedCookies['connect.sid'] !== req.sessionID ){
            res.render('login', {error: null})
        }
        next()
    }
}