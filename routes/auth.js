var express = require('express');
var request = require('request');
var User = require('../models/User');
var jwt = require('jwt-simple');
var moment = require('moment');
var serverConfig = require('../serverConfig');

var router = express.Router();

router.post('/google', function(req,res,next) {
    var switchCodeForTokenUrl = serverConfig.GoogleSwitchCodeForTokenUrl;
    var formParams = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code',
        client_secret: serverConfig.GoogleClietSecret
    }

    request.post(switchCodeForTokenUrl, {
        json: true,
        form: formParams
    }, function(err, response, token) {
        var headers = {Authorization : 'Bearer '+token.access_token};

        request.get({
            url : serverConfig.GoogleApiUrl,
            headers : headers,
            json : true
        }, function(err, response, profile) {

            if(profile.error)
                return console.log(profile.error);

            User.findOne({googleId: profile.sub}, function(err, foundUser) {
                if(foundUser) return createSendToken(foundUser, res);

                var newUser = new User({
                    googleId: profile.sub,
                    displayName: profile.name,
                    email: profile.email
                });

                newUser.save(function(err) {
                    if(err) return next(err);

                    return createSendToken(newUser, res)
                });
            });
        });
    });
});

router.post('/linkedin', function(req,res,next) {
    var switchCodeForTokenUrl = serverConfig.LinkedinSwitchCodeForTokenUrl;
    var formParams = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code',
        client_secret: serverConfig.LinkedinClietSecret
    }

    request.post(switchCodeForTokenUrl, {
        json: true,
        form: formParams
    }, function(err, response, token) {
        var headers = {Authorization : 'Bearer '+token.access_token};

        request.get({
            url : serverConfig.LinkedinApiUrl,
            headers : headers,
            json : true
        }, function(err, response, profile) {

            if(profile.error)
                return console.log(profile.error);

            User.findOne({linkedinId: profile.id}, function(err, foundUser) {
                if(foundUser) return createSendToken(foundUser, res);

                var newUser = new User({
                    linkedinId: profile.id,
                    displayName: profile.firstName +' '+profile.lastName,
                    email : profile.emailAddress
                });

                newUser.save(function(err) {
                    if(err) return next(err);

                    return createSendToken(newUser, res)
                });
            });
        });
    });
});

router.post('/register', function(req,res, next) {
    var cUser = req.body;
    if(!cUser || !cUser.email)
        return res.status(401).send({message: 'User was not recieved by server'});
    User.findOne({email : cUser.email}, function(err, user) {
        if (err) return next(err);
        if (user) return res.status(401).send({message: 'Email Already exists!!!'});

        var newUser = new User({
            email: cUser.email,
            password: cUser.password
        });
        newUser.save(function (err) {
            if (err) return next(err);
            createSendToken(newUser, res);
        });
    });
});

router.post('/login', function(req,res, next) {
    var cUser = req.body;
    if(!cUser || !cUser.email)
        return res.status(401).send({message: 'User was not recieved by server'});
    User.findOne({email : cUser.email}, function(err, user) {
        if(err) return next(err);
        if(!user) return res.status(401).send({message : 'Wrong Email!'});

        user.comparePasswords(cUser.password, function(err, isMatched) {
            if(err) return next(err);
            if(!isMatched)
                return res.status(401).send({message: 'Wrong password!'});

            createSendToken(user, res);
        });

    });
});

function createSendToken(user, res) {
    var payload = {
        subject: user.id,
        exp : moment().add(10, 'days').unix()
    }
    var token = jwt.encode(payload, serverConfig.JwtSecret);
    res.status(200).send({
        user : user.toJSON(),
        token: token
    });
}

module.exports = router;