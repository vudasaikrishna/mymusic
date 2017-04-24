module.exports = function (app, model) {

    //var userModel = require('./../model/user/user.model.server')();

    var userModel = model.userModel;
    var trackModel = model.trackModel;
    var bcrypt = require("bcrypt-nodejs");


    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new LocalStrategy(localStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/loggedin', loggedin);
    app.post('/api/user/search', searchUsers);
    app.get('/api/user/favorite', getFavorites);
    app.get('/api/user/message', getMessages);
    app.post('/api/user/addtrack/:trackId', addTrack);
    app.post('/api/user/removetrack/:trackId', removeTrack);
    app.post('/api/user/:userId/addMessage', addMessage);
    app.post('/api/user/:userId/removeMessage', removeMessage);
    app.post('/api/logout', logout);
    app.post('/api/isAdmin', isAdmin);
    app.post('/api/isArtist', isArtist);
    app.post("/api/register", register);
    app.get("/api/user/all", findAllUsers);
    app.get("/api/artist", findAllArtists);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/profile/:userId", updateProfile);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/home',
            failureRedirect: '/#/login'
        }));


    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
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
        console.log(password);
        //password = bcrypt.hashSync(password);
        // console.log(password);
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    //console.log('db success');
                    //console.log(user);
                    if (!user) {
                        //console.log('no user found');
                        return done(null, false);
                    }
                    //console.log('[2]');
                    //console.log(user);
                    if (bcrypt.compareSync(password, user.password)) {
                        //console.log("Success")
                        return done(null, user);
                    } else {
                        //console.log("Error");
                        return done(null, false);
                    }
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

    function getFavorites(req, res) {
        if(req.isAuthenticated()) {
            userModel
                .getFavorites(req.user._id)
                .then(function (favorites) {
                    res.json(favorites);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function getMessages(req, res) {
        if(req.isAuthenticated()) {
            userModel
                .getMessages(req.user._id)
                .then(function (messages) {
                    //console.log(messages);
                    res.json(messages);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function searchUsers(req, res) {
        if(req.isAuthenticated()) {
            userModel
                .searchUsers(req.query.key)
                .then(function (users) {
                    if (users)
                        res.json(users);
                    else
                        res.sendStatus(500);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function addMessage(req, res) {
        //console.log("Adding Message. Service");
        if(req.isAuthenticated()) {
            userModel
                .addMessage(req.params.userId, req.body)
                .then(function (success) {
                    res.sendStatus(200);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function removeMessage(req, res) {
        if(req.isAuthenticated()) {
            userModel
                .removeMessage(req.params.userId, req.body)
                .then(function (success) {
                    res.sendStatus(200);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function addTrack(req, res) {
        if(req.isAuthenticated()) {
            userModel
                .addTrack(req.user._id, req.params.trackId)
                .then(function (success) {
                    trackModel
                        .addLover(req.user._id, req.params.trackId)
                        .then(function (success) {
                            res.sendStatus(200);
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function removeTrack(req, res) {
        console.log(req.user.favorites);
        //console.log(req.params.trackId);
        if(req.isAuthenticated()) {
            userModel
                .removeTrack(req.user._id, req.params.trackId)
                .then(function (success) {
                    console.log(success.favorites);
                    trackModel
                        .removeLover(req.user._id, req.params.trackId)
                        .then(function (success) {
                            res.sendStatus(200);
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500).send(err);
                });
        } else {
            //console.log("error 401");
            res.sendStatus(401);
        }
    }

    function isAdmin(req, res) {
        if(req.isAuthenticated() && req.user.role == 'ADMIN') {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function isArtist(req, res) {
        if(req.isAuthenticated() && req.user.role == 'ARTIST') {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function findAllArtists(req, res) {
        userModel
            .findAllArtists()
            .then(function (artists) {
                res.json(artists);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findAllUsers(req, res) {
        //console.log("trying to find");
        if(req.user && req.user.role=='ADMIN') {
            //console.log("finding users");
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
        req.body.password = bcrypt.hashSync(req.body.password);
        userModel
            .createUser(req.body)
            .then(function (user) {
                if(user) {
                    //console.log("Registered.. logging in.");
                    req.login(user, function (err) {
                        //console.log("Guess an error logging in.");
                        //console.log(user);
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
    }

    function findUser(req, res) {
        var username = req.query.username;
        var screenName = req.query.screenName;
        if(screenName) {
            findUserByScreenName(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByScreenName(req, res) {
        userModel
            .findUserByScreenName(req.query.screenName)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
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