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
                    // track already exists. send it back
                    console.log("Track already exists");
                    res.json(track);

                } else {
                    // track doesn't exist, so add one
                    console.log("Track doesn't exist");
                    // check if the aritst already exists
                    userModel
                        .findUserByScreenName(req.body.artist)
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            // Create or Fetch Artist
            // ----------------------
            .then(function (user) {
                if(user){
                    // artist exists. just create the track
                    console.log("Artist exists!");
                    // returning a promise for the next call.
                    return userModel.findUserByScreenName(user.screenName)
                } else {
                    // create a new user with the artist details
                    user = {
                        screenName: req.body.artist,
                        firstName: req.body.artist,
                        external: true,
                        role: 'ARTIST'
                    };
                    console.log("Creating Artist");
                    return userModel
                        .createUser(user)
                }
            })
            // Create Track
            // ------------
            .then(function (user) {
                req.body.artist = user._id;
                return trackModel
                    .createTrack(req.body)
            }, function (err) {
                console.log(err);
                res.sendStatus(500).send(err);
            })
            // Respond
            // -------
            .then(function (track) {
                console.log("Track added now.");
                //console.log(track);
                res.json(track);
            }, function (err) {
                console.log(err);
                res.sendStatus(500).send(err);
            })
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
                    console.log("Creating Artist");
                    return userModel
                        .createUser(user)
                }
            })
            .then(function (user) {
                track.artist = user._id;
                return trackModel
                    .createTrack(track)
            }, function (err) {
                console.log(err);
                res.sendStatus(500).send(err);
            })
            .then(function (track) {
                console.log("Track added now.");
                console.log(track);
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