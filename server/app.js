var config = require('./config')
var express = require('express')
var router = require('./router')

var app = express()

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
app.set('views', [__dirname + '/../client'])

app.use('/', router)

app.listen(config.port, function(){
    console.log('----- NodeJS Server started on port ' + config.port + ', press Ctrl-C to terminate.-----')
})