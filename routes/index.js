/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Fri Jul 21 2017
 *  File : index.js
 *******************************************/
const vendorRoutes = require("./vendors");
const userRoutes = require("./users");
const path = require('path');

const constructorMethod = (app) => {
    app.use("/vendors", vendorRoutes);
    app.use("/", userRoutes);

    app.use("*", (req, res) => {
        res.redirect("/");
    });
};

module.exports = constructorMethod;

//////////////////////////////
var express = require('express');
var router = express.Router();
var db = require('../db');
var passport = require('passport');
var theUser = require('../schemas/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET registration page */

router.get('/register', function(req, res){
	res.render('register')
});

router.post('/register', function(req, res){
	// check the database for the username
	theUser.find({username: req.param('username')}, function(err, data){
		if(err){
			console.log(err)
		}
		//if there's no data returned, create the user
		if(!data.length){
			var newUser = new theUser({
				username : req.param('username'),
				password : req.param('password')
			});

			newUser.save(function(err){
				if(err){
					console.log(err)
				}
				res.json({message: req.param('username') + ' has been successfully registered'})
			});
		// otherwise send an error message
		} else{
			res.json({message : 'That username is already taken!'})
		}
	});
});

/* Get Login Page */

router.get('/login', function(req,res){
	// if a user is already logged in
    if (req.session.passport.user != undefined) {
        res.redirect('/user');
    }
	res.render('login')
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                'error': info.message
            });
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/user');
        });
    })(req, res, next);
});

router.get('/user', function(req, res){
	if (req.session.passport.user == undefined) {
        res.redirect('/login');
    } else {
    	res.render('user', {user: req.user.username});
    }
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;