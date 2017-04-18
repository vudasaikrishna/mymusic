module.exports = function (model) {

    //console.log("File included");
    var q = require('q');
    var mongoose = require('mongoose');

    var trackSchema = require('./track.schema.server.js')();
    var trackModel = mongoose.model('MymusicTrack', trackSchema);

    var api = {
        getTrackInfo: getTrackInfo,
        createTrack: createTrack,
        addComment: addComment,
        addLover: addLover,
        removeLover: removeLover
    };
    return api;

    function removeLover(userId, trackId) {
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (err, track) {
                if (err) {
                    deferred.reject(err);
                } else{
                    for(var u in track.loves) {
                        if (track.loves[u] == userId) {
                            console.log("removeLover");
                            track.loves.splice(u,1);
                            track.save();
                        }
                    }
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function addLover(userId, trackId) {
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (err, track) {
                if (err) {
                    deferred.reject(err);
                } else{
                    console.log("addLover");
                    track.loves.push(userId);
                    track.save();
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function addComment(trackId, comment) {
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (err, track) {
                if (err) {
                    deferred.reject(err);
                } else{
                    track.comments.push(comment);
                    track.save();
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function createTrack(track) {
        var deferred = q.defer();
        trackModel
            .create(track, function (err, track) {
                if (err) {
                    deferred.reject(err);
                } else{
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function getTrack(mbid) {
        var deferred = q.defer();
        trackModel
            .findOne({mbid: mbid}, function (err, track) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function getTrackInfo(mbid) {
        var deferred = q.defer();
        trackModel
            .findOne({mbid: mbid})
            .populate({path:'comments.user', select: 'firstName'})
            .exec(function (err, track) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

};