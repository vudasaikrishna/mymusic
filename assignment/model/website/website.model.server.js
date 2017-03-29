module.exports = function () {

    var q = require('q');
    var mongoose = require('mongoose');

    var websiteSchema = require('./website.schema.server.js')();
    var websiteModel = mongoose.model('AssignmentWebsite', websiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        addPage: addPage,
        removePage: removePage
    };
    return api;

    function removePage(pageId) {
        var deferred = q.defer();
        //console.log(pageId);
        websiteModel
            .findOne({pages: pageId}, function (err, website) {
                if(err){
                    deferred.abort(err);
                } else {
                    //console.log("WEbsite: "+website);
                    var ind = website.pages.indexOf(pageId);
                    website.pages.splice(ind,1);
                    website.save();
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }

    function addPage(websiteId, pageId) {
        var deferred = q.defer();
        websiteModel
            .findById(websiteId, function (err, website) {
                if(err) {
                    deferred.reject(err);
                } else {
                    website.pages.push(pageId);
                    website.save();
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }
    function deleteWebsite(websiteId) {
        var deferred = q.defer();
        websiteModel
            .remove({_id: websiteId}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
    function updateWebsite(websiteId, newwebsite) {
        var deferred = q.defer();
        newwebsite.lastUpdated = Date.now();
        websiteModel
            .update({_id: websiteId}, {$set: newwebsite}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
    function findWebsiteById(websiteId) {
        var deferred = q.defer();
        websiteModel
            .findById(websiteId)
            .populate('_user', 'username')
            .exec(function (err, website) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }

    function findAllWebsitesForUser(userId) {
        var deferred = q.defer();
        websiteModel
            .find({_user: userId})
            .populate('_user', 'username')
            .exec(function (err, websites) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(websites);
                }
            });
        return deferred.promise;
    }
    function createWebsiteForUser(userId, website) {
        var deferred = q.defer();
        website._user = userId;
        websiteModel
            .create(website, function (err, website) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(website);
                }
            });
        return deferred.promise;
    }
};