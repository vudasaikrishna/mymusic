module.exports = function () {
    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        screenName: String,
        external: Boolean,
        email: String,
        phone: String,
        photo: String,
        google: {
            id: String
        },
        facebook: {
            id: String
        },
        role: {type: String, enum: ['ADMIN', 'ARTIST', 'USER'], default: 'USER'},
        favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'MymusicTrack'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'mymusic.user'});

    return userSchema;
};