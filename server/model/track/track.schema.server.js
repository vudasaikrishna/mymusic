module.exports = function () {
    var mongoose = require('mongoose');

    var trackSchema = mongoose.Schema({
        title: String,
        url: String,
        artist: {type: mongoose.Schema.Types.ObjectId, ref: 'MymusicUser'},
        image: String,
        loves: [{type: mongoose.Schema.Types.ObjectId, ref: 'MymusicUser'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'mymusic.track'});

    return trackSchema;
};