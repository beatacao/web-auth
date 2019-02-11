var config = require('./config')
var express = require('express')
var router = require('./router')
// var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')

var app = express()

// app.use(cookieParser('site_secret'))
app.use(session({
    secret: 'site_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 6*60*60*1000
    }
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
app.set('views', [__dirname + '/../client'])

app.use('/', router)

app.listen(config.port, function(){
    console.log('----- NodeJS Server started on port ' + config.port + ', press Ctrl-C to terminate.-----')
})