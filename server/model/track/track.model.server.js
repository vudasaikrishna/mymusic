module.exports = function (model) {

    //console.log("File included");
    var q = require('q');
    var mongoose = require('mongoose');

    var trackSchema = require('./track.schema.server.js')();
    var trackModel = mongoose.model('MymusicTrack', trackSchema);

    var api = {
        getTrackInfo: getTrackInfo,
        createTrack: createTrack,
        addComment: addComment
    };
    return api;

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