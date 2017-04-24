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
        removeLover: removeLover,
        findTrackByArtist: findTrackByArtist,
        findTrackById: findTrackById,
        findTrackBymbid: findTrackBymbid
    };
    return api;

    function findTrackBymbid(mbid) {
        var deferred = q.defer();
        trackModel
            .findOne({mbid: mbid}, function (err, track) {
                if(err) {
                    //console.log(err);
                    deferred.reject(err);
                } else {
                    //console.log(track);
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function findTrackById(trackId) {
        console.log(trackId);
        var deferred = q.defer();
        trackModel
            .findById(trackId)
            .populate({path:'artist comments.user', select: 'screenName firstName'})
            .exec(function (err, track) {
                if(err) {
                    //console.log(err);
                    deferred.reject(err);
                } else {
                    //console.log(track);
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function findTrackByArtist(userId) {
        var deferred = q.defer();
        trackModel
            .find({artist: userId})
            .populate({path:'artist', select: 'screenName'})
            .exec(function (err, tracks) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(tracks);
                }
            });
        return deferred.promise;
    }

    function removeLover(userId, trackId) {
        console.log(userId,trackId);
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (err, track) {
                if (err) {
                    deferred.reject(err);
                } else{
                    console.log("removing lover");
                    console.log(track.loves);
                    /*track.loves = track.loves.filter(function (u) {
                        return !u.equals(userId);
                    });*/
                    //console.log(track.loves.length);
                    for(var u in track.loves) {
                        if (track.loves[u].equals(userId)) {
                            console.log("removeLover");
                            track.loves.splice(u,1);
                            track.save();
                            break;
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
        console.log("Creating Track");
        var deferred = q.defer();
        trackModel
            .create(track, function (err, track) {
                if (err) {
                    console.log(err);
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