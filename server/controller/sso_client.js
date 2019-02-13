
module.exports = {
    verify: function(req, res, next){
        if(req.session && req.session.isLogin){
            return next()
        }
        var token = req.query.token 
        var isAuthed = false 
        if(token){
            // 验证token有效性
            isAuthed = true  
        }
        if(isAuthed){
            res.cookie('connect.sid', token, {signed: true, maxAge: 1000*60*10, httpOnly: true, secure: true, sameSite: 'strict'})
            req.session.isLogin = true
            return next()
        }
        var url = req.headers.host + req.url
        return res.redirect('http://www.sso-server.com:5566/sso-server/login?site=' + url)
    }
}