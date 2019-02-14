var http = require('http')
var axios = require('axios')

var client_token_secret = 'client_token_secret'

module.exports = {
    verify: () => {
        return async function(req, res, next){
            if(req.session && req.session.isLogin){
                return next()
            }
            var token = req.query.token 
            var isAuthed = false
            if(token){
                //验证token有效性   
                try{
                    var result = await axios.get('http://www.sso-server.com:5566/sso-server/verifytoken?token='+token, {
                        headers: {
                            Authorization: "Bearer " + client_token_secret
                        }
                    })
                    isAuthed = result.data.success
                }catch(err){
                    console.log('error')
                    return next(err)
                }
            }
            if(isAuthed){
                req.session.isLogin = true
                return next()
            }
            var query = ''
            for(var key in req.query){
                if(key !== 'token'){
                    query += key + '=' + req.query[key]
                }
            }
            var url = req.headers.host + req.path + (query.length>0 ?  '?' + query : '')
            return res.redirect('http://www.sso-server.com:5566/sso-server/login?site=' + url)
        }
    }
}