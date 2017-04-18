module.exports = function (app, model) {
    var userModel = model.userModel;

    var multer = require('multer'); // npm install multer --save
    var upload = multer({
        dest: __dirname+'/../../public/uploads'
    });

    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    function uploadImage(req, res) {

        var userId        = req.user._id;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        console.log(userId);
        userModel
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
            });
    }

};