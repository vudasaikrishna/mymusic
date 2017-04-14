module.exports = function (app, model) {

    //var userModel = require('./../model/user/user.model.server')();

    var userModel = model.userModel;

    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new LocalStrategy(localStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/loggedin', loggedin);
    app.post('/api/logout', logout);
    app.post('/api/isAdmin', isAdmin);
    app.post("/api/register", register);
    app.get("/api/user", findAllUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/profile/:userId", updateProfile);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/profile',
            failureRedirect: '/#/login'
        }));


    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID || "312560962266-cjg8lvsncngp420upkjqbsbo9s3lbcso.apps.googleusercontent.com",
        clientSecret : process.env.GOOGLE_CLIENT_SECRET || "3EvjPnLR-9xpZS76dO-_f920",
        callbackURL  : process.env.GOOGLE_CALLBACK_URL || "http://127.0.0.1:3000/google/callback"
    };


    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        //console.log("Google Strategy");
        //console.log(profile.id);
        userModel
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                //console.log(user);
                if(user) {
                    //console.log(111);
                    done(null, user);
                } else {
                    //console.log(222);
                    var user = {
                        username: profile.emails[0].value,
                        photo: profile.photos[0].value,
                        firstName: profile.name.givenName,
                        lastName:  profile.name.familyName,
                        email:     profile.emails[0].value,
                        google: {
                            id:    profile.id
                        }
                    };
                    return userModel.createUser(user);
                }
            }, function (err) {
                //console.log(err);
                done(err, null);
            })
            .then(function (user) {
                done(null, user);
            }, function (err) {
                //console.log(err);
                done(err, null);
            });
    }

    function localStrategy(username, password, done) {
        //console.log(username);
        //console.log(password);
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    //console.log('[0]');
                    //console.log(user);
                    if (!user) {
                        //console.log('[1]');
                        return done(null, false);
                    }
                    //console.log('[2]');
                    //console.log(user);
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function updateProfile(req, res) {
        if(req.user && req.user._id == req.body._id) {
            userModel
                .updateProfile(req.body)
                .then(function (status) {
                    res.send(200);
                });
        } else {
            res.json({});
        }
    }

    function login(req, res) {
        //console.log('[login]');
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        if(req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function isAdmin(req, res) {
        if(req.isAuthenticated() && req.user.role == 'ADMIN') {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function findAllUsers(req, res) {
        console.log("trying to find");
        if(req.user && req.user.role=='ADMIN') {
            console.log("finding users");
            userModel
                .findAllUsers()
                .then(function (users) {
                    res.json(users);
                });
        } else {
            console.log("Failed")
            res.json({});
        }
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    console.log(err);
                    done(err, null);
                }
            );
    }

    function register(req, res) {
        //console.log(req.body);
        userModel
            .createUser(req.body)
            .then(function (user) {
                if(user) {
                    console.log("Registered.. logging in.");
                    req.login(user, function (err) {
                        console.log("Guess an error logging in.");
                        console.log(user);
                        res.json(user);
                    });
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteUser(req, res) {
        if(req.user && req.user.role=='ADMIN') {
            userModel
                .deleteUser(req.params.userId)
                .then(function (status) {
                    res.send(status);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else{
            res.sendStatus(401);
        }
    }

    function updateUser(req, res) {
        if(req.user && req.user.role=='ADMIN') {
            userModel
                .updateProfile(req.body)
                .then(function (status) {
                    res.send(status);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        var user = users.find(function (u) {
            return u._id == userId;
        });
        res.json(user);*/
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            findUserByCredentials(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        userModel
            .findUserByUsername(req.query.username)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }
}