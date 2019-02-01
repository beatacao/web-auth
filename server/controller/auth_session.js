module.exports = {
    session: function(req, res, next){
        if(!req.cookies['SESSIONID'] || req.cookies['SESSIONID'] !== req.sessionID ){
            res.render('login', {error: null})
        }
        next()
    }
}