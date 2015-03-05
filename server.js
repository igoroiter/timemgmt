var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var authRouter = require('./routes/auth');
var serverConfig = require('./serverConfig');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

app.use('/auth', authRouter);

app.get('/partials/:partial', function(req, res) {
    res.render('partials/' + req.params.partial);
});

var contacts = ['pini', 'gershon', 'gavnuk'];
app.get('/contacts', function(req, res) {
    if(!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }

    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, serverConfig.JwtSecret);

    if(!payload.subject)
        return res.status(401).send({message: 'Authentication Failed'});

    res.json(contacts);
});

app.get('*', function(req, res) {
    res.render('index');
});

mongoose.connect(serverConfig.MongoConnString);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
