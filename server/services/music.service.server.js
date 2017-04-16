module.exports = function (app, model) {
    /*app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findPageByWebsiteId);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);
*/
    app.get('/api/track/:trackId', findTrackById);
    app.post('/api/track', getTrackInfo);

    var userModel = model.userModel;
    var trackModel = model.trackModel;

    // API KEy and Secret
    var key = /*process.env.API_KEY ||*/ "82d41887eded3508556137889b65f14e";
    var secret = /*process.env.API_SECRET// ||*/ "fb228a0b77eec1eed2c24ff9a6f5cee8";
    var urlBase = "http://ws.audioscrobbler.com/2.0/?method=METHOD&PARAMS&api_key=API_KEY&format=json";

    // TODO: Track crud functions

    function getTrackInfo(req, res) {
        trackModel
            .getTrackInfo(req.body.mbid)
            .then(function (track) {
                if(track) {
                    console.log("Track already exists");
                    res.json(track);
                } else {
                    // track doesn't exist, so add one
                    console.log("Track doesn't exist");
                    return createTrack(req.body);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            /*.then(function (user) {
                if(user){
                    console.log("Artist exists!");
                    return userModel.findUserByScreenName(user)
                } else {
                    user = {
                        screenName: req.body.artist,
                        firstName: req.body.artist,
                        external: true,
                        role: 'ARTIST'
                    };
                    return userModel
                        .createUser(user)
                }
            })
            .then(function (user) {
                trackModel
                    .createTrack(req.body)
            })
            .then(function (track) {
                console.log("Track added now.");
                res.json(track);
            }, function (err) {
                console.log(err);
                res.sendStatus(500).send(err);
            })*/
    }

    function createTrack(track) {
        userModel
            .findUserByScreenName(track.artist)
            .then(function (user) {
                if(user){
                    console.log("Artist exists!");
                    // returning a promise for the next call.
                    return userModel.findUserByScreenName(user.screenName)
                } else {
                    user = {
                        screenName: track.artist,
                        firstName: track.artist,
                        external: true,
                        role: 'ARTIST'
                    };
                    return userModel
                        .createUser(user)
                }
            })
            .then(function (user) {
                track.artist = user._id;
                return trackModel
                    .createTrack(track)
            })
            .then(function (track) {
                console.log("Track added now.");
                res.json(track);
            }, function (err) {
                console.log(err);
                res.sendStatus(500).send(err);
            })
    }
    function findTrackById(req, res) {
        var trackId = req.params.trackId;
        var method = "track.getInfo";
        var params = "mbid="+trackId;
        var url = urlBase
            .replace("API_KEY", key)
            .replace("METHOD", method)
            .replace("PARAMS", params);

    }
};