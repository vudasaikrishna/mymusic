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
        findUserByGoogleId: findUserByGoogleId,
        findAllUsers: findAllUsers,
        addTrack: addTrack,
        removeTrack: removeTrack,
        getFavorites: getFavorites,
        searchUsers: searchUsers,
        addMessage: addMessage,
        removeMessage: removeMessage,
        getMessages: getMessages
    };
    return api;

    function addMessage(userId, message) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    // add it
                    console.log("addMessage");
                    user.messages.push(message);
                    user.save();
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function removeMessage(userId, message) {
        console.log(message);
        var deferred = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    console.log(userId);
                    for(var m in user.messages) {
                        if ((user.messages[m].user == message.user._id) &&
                            (user.messages[m].track == message.track._id)){
                            console.log("removeMessage");
                            user.messages[m].read = true;
                            user.save();
                        }
                    }
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function getMessages(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId)
            .populate({path:'messages.user messages.track',
                select:'firstName lastName title mbid'})
            .exec(function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    deferred.resolve(user.messages);
                }
            });
        return deferred.promise;
    }

    function getFavorites(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId)
            .populate({path:'favorites',
                populate: {path:'artist', select:'screenName'}})
            .exec(function (err, user) {
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
                        if (user.favorites[t] == trackId) {
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

    function searchUsers(searchTerm) {
        var deferred = q.defer();
        userModel
            .find({$or:[ {username: { "$regex": searchTerm, "$options": "i" }},
                    {firstName: { "$regex": searchTerm, "$options": "i" }},
                    {lastName: { "$regex": searchTerm, "$options": "i" },} ],
                role: 'USER'},
                function (err, users) {
                if(err){
                    deferred.abort(err);
                } else {
                    deferred.resolve(users);
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
        //console.log("updating profile")
        return userModel.update({_id: user._id},
            {$set: {firstName: user.firstName,
                lastName: user.lastName,
            photo: user.photo,
            email: user.email}});
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