module.exports = function (model) {

    //console.log("File included");
    var q = require('q');
    var mongoose = require('mongoose');

    var userSchema = require('./user.schema.server')();
    var userModel = mongoose.model('MymusicUser', userSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByScreenName: findUserByScreenName,
        findUserByCredentials: findUserByCredentials,
        updateProfile: updateProfile,
        deleteUser: deleteUser,
        addWebsite: addWebsite,
        removeWebsite: removeWebsite,
        findUserByGoogleId: findUserByGoogleId,
        findAllUsers: findAllUsers,
        addTrack: addTrack,
        removeTrack: removeTrack,
        getFavorites: getFavorites
    };
    return api;

    function getFavorites(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    deferred.resolve(user.favorites);
                }
            });
        return deferred.promise;
    }

    function addTrack(userId, trackId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    // add it
                    console.log("addFavorite");
                    user.favorites.push(trackId);
                    user.save();
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function removeTrack(userId, trackId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    for(var t in user.favorites) {
                        if (user.favorites[t]._id == trackId) {
                            console.log("removeFavorite");
                            user.favorites.splice(t,1);
                            user.save();
                        }
                    }
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findAllUsers() {
        return userModel.find();
    }

    function findUserByGoogleId(googleId) {
        return userModel.findOne({
            'google.id': googleId
        });
    }

    function removeWebsite(websiteId) {
        var deferred = q.defer();
        userModel
            .find({websites: websiteId}, function (err, users) {
                if(err){
                    deferred.abort(err);
                } else {
                    //console.log(users);
                    for(var u in users) {
                        var ind = users[u].websites.indexOf(websiteId);
                        users[u].websites.splice(ind,1);
                        users[u].save();
                    }
                    deferred.resolve(users);
                }
            });
        return deferred.promise;
    }
    function addWebsite(userId, websiteId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err) {
                    deferred.reject(err);
                } else {
                    user.websites.push(websiteId);
                    user.save();
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();
        userModel
            .remove({_id: userId}, function (err, status) {
                if(err){
                    deferred.abort(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    function updateProfile(user) {
        return userModel.update({_id: user._id},
            {$set: {firstName: user.firstName}});
    }

    function updateUser(user) {
        var deferred = q.defer();
        userModel
            .update({_id: user._id}, {$set:user}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        userModel
            .findOne({username: username, password: password},
                function (err, user) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        userModel
            .findOne({username: username}, function (err, user) {
            //console.log([err,user]);
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserByScreenName(screenName) {
        var deferred = q.defer();
        userModel
            .findOne({screenName: screenName}, function (err, user) {
                //console.log([err,user]);
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function createUser(user) {
        //console.log("model");
        var deferred = q.defer();
        userModel
            .create(user, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else{
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }
};