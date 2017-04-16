module.exports = function (app) {
    var userModel = require('./user/user.model.server')();
    var trackModel = require('./track/track.model.server')();
    var websiteModel = require('./website/website.model.server')();
    var pageModel = require('./page/page.model.server')();
    var widgetModel = require('./widget/widget.model.server')();
    var model = {
        userModel: userModel,
        trackModel: trackModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };
    return model;
};
