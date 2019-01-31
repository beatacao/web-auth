var express = require('express')
var auth_http = require('./controller/auth_http')

var router = express.Router()

router.get('/docs', auth_http.basic, function(req, res){
    res.render('docs')
})

router.get('/logout', function(req, res){
    res.send('logout')
})

module.exports = router