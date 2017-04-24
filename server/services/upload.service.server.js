module.exports = function (app, model) {
    var userModel = model.userModel;
    var trackModel = model.trackModel;

    var multer = require('multer'); // npm install multer --save
    var upload = multer({
        dest: __dirname+'/../../public/uploads'
    });

    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.post ("/api/upload/track", upload.array('myFile'), uploadTrack);

    function uploadTrack(req, res) {

        var userId        = req.user._id;
        var myFiles        = req.files;

        //console.log(myFiles);
        if (myFiles.length < 2) {
            res.sendStatus(500);
            return;
        }

        var imagename      = myFiles[0].filename;     // new file name in upload folder
        var trackname      = myFiles[1].filename;     // new file name in upload folder

        //console.log(req.body);
        //console.log(req.user);

        var track = {
            title: req.body.title,
            artist: req.user._id,
            url: '/uploads/'+trackname,
            image: '/uploads/'+imagename,
            wiki: {
                summary: req.body.summary
            }
        };
        //res.sendStatus(200);
        trackModel
            .createTrack(track)
            .then(function (track) {
                //console.log(track);
                res.redirect('/#/mytracks');
            }, function (err) {
                res.sendStatus(500).send(err);
            });
/*        userModel
            .findUserById(userId)
            .then(function (user) {
                user.photo = '/uploads/'+filename;
                console.log(user);

                return userModel
                    .updateProfile(user);
            })
            .then(function (user) {
                // var callbackUrl   = "#/profile";
                console.log("IMage added");
                // res.sendStatus(204);
                res.redirect('back');
            }, function (err) {
                res.sendStatus(500).send(err);
            });*/
    }

    function uploadImage(req, res) {

        var userId        = req.user._id;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        //console.log(userId);
        userModel
            .findUserById(userId)
            .then(function (user) {
                user.photo = '/uploads/'+filename;
                //console.log(user);

                return userModel
                    .updateProfile(user);
            })
            .then(function (user) {
                // var callbackUrl   = "#/profile";
                //console.log("IMage added");
                // res.sendStatus(204);
                res.redirect('/#/profile');
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

};