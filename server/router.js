var express = require('express')
var auth_http = require('./controller/auth_http')
var auth_session = require('./controller/auth_session')
var auth_token = require('./controller/auth_token')
var service_user = require('./service/users')
var jwt = require('jsonwebtoken')

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
        res.end('登录成功')
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

module.exports = router