var express = require('express')
var app = express()

app.get('/auth_basic', function(req, res){
    if(!req.headers.authorization){
        res.append('WWW-Authenticate', 'Basic realm="Secure Area"')
        res.status(401).end()
    }else{
        res.send('ok')
    }
    
})

app.listen(5566, function(){
    console.log('----- NodeJS Server started on port 5566, press Ctrl-C to terminate.-----')
})