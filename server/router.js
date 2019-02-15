var express = require('express')
var auth_http = require('./controller/auth_http')
var auth_session = require('./controller/auth_session')
var auth_token = require('./controller/auth_token')
var sso_client = require('./controller/sso_client')
var sso_server = require('./controller/sso_server')
var service_user = require('./service/users')
var jwt = require('jsonwebtoken')
var http = require('http')
var axios = require('axios')

var router = express.Router()

router.get('/docs', auth_http.basic, function(req, res){
    res.end('docs')
})

router.get('/articles', auth_http.digest, function(req, res){
    res.end('articles')
})

router.get('/comments', auth_session.session, function(req, res){
    res.end('comments')
})

router.get('/photos', auth_token.tokenVerify, function(req, res){
    res.end('photos')
})

router.post('/login', function(req, res, next){
    var user = service_user.getUsers(req.body.username)
    if(req.body.username === user.name && req.body.password === user.password){
        if(req.headers.referer.indexOf('/comments') > -1){
            auth_session.sessionGenerate(req, res, next)
        }
        if(req.headers.referer.indexOf('/photos') > -1){
            auth_token.tokenSign(req, res, next)
        }
        res.redirect(req.headers.referer)
    }else{
        res.render('login', {'error': '密码错误'})
    }
})

router.get('/logout', function(req, res, next){
    req.session.destroy(function(err) {
        if(err){
            res.end('退出失败');
            return;
        }
        
        res.clearCookie('connect.sid');
        res.redirect('/comments');
    });
})

var subSites = [
    'www.sso-client1.com',
    'www.sso-client2.com',
]

// sso client
router.get(/^\/page\/(.)+$/, sso_client.verify(), function(req, res){
    return res.send('<p>site: "'+req.headers.host+'"</p><p>path: "'+req.url+'"</p><p><a href="http://www.sso-server.com:5566/sso-server/logout">登出</a></p>')
})
router.get('/sso-client/logout', function(req, res, next){
    res.clearCookie('connect.sid')
    return res.end()
})

// sso server
router.get('/sso-server/login', function(req, res){
    
    // 检查是否已从其他系统登录过    
    if(req.session.isLogin) {
        if(!req.query || !req.query.site){
            res.end('已登录')
        }
        var url = 'http://' + req.query.site
        
        return res.redirect(url + '?token=' + req.sessionID)
    }

    // 如果没登录过，返回登录页面
    return res.render('login', {error: null})
})

router.post('/sso-server/login', function(req, res, next){
    var user = service_user.getUsers(req.body.username)
    if(req.body.username === user.name && req.body.password === user.password){
        // 设置全局session   
        req.session.isLogin = true
        
        if(req.headers.referer.split('?site=')[1]){
            var url = 'http://' + req.headers.referer.split('?site=')[1]
            res.redirect(url + '?token=' + req.sessionID)
        }else{
            res.end('已登录')
        }
        
    }else{
        res.render('login', {'error': '密码错误'})
    }
})

router.get('/sso-server/verifytoken', sso_server.verifytoken)

router.get('/sso-server/logout', function(req, res, next){
    res.clearCookie('connect.sid')
    // 清除子站sessionid
    subSites.forEach(function(host){
        axios.get('http://' + host + ':5566/sso-client/logout')
    })
    res.render('sso-logout')
})

module.exports = router