module.exports = function (model) {

    //console.log("File included");
    var q = require('q');
    var mongoose = require('mongoose');

    var userSchema = require('./user.schema.server')();
    var userModel = mongoose.model('AssignmentUser', userSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        addWebsite: addWebsite,
        removeWebsite: removeWebsite
    };
    return api;

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
    function updateUser(userId, newuser) {
        var deferred = q.defer();
        userModel
            .update({_id: userId}, {$set:newuser}, function (err, status) {
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