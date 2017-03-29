module.exports = function () {
    var mongoose = require('mongoose');

    var websiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentUser'},
        name: String,
        description: String,
        pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentPage'}],
        dateCreated: {type: Date, default: Date.now},
        lastUpdated: {type: Date, default: Date.now}
    }, {collection: 'assignment.website'});

    return websiteSchema;
};