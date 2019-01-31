var express = require('express')
var auth_http = require('./controller/auth_http')

var router = express.Router()

router.get('/docs', auth_http.basic, function(req, res){
    res.end('docs')
})

router.get('/articles', auth_http.digest, function(req, res){
    res.end('articles')
})

router.get('/logout', function(req, res){
    res.end('logout')
})

module.exports = router