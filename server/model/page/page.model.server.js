module.exports = function () {

    var q = require('q');
    var mongoose = require('mongoose');

    var pageSchema = require('./page.schema.server.js')();
    var pageModel = mongoose.model('AssignmentPage', pageSchema);

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        addWidget: addWidget,
        removeWidget: removeWidget,
        reorderWidget: reorderWidget
    };
    return api;

    function reorderWidget(pageId, start, end) {
        var deferred = q.defer();

        pageModel
            .findOne({_id: pageId}, function (err, page) {
                if(err){
                    deferred.abort(err);
                } else {
                    //console.log(page);
                    page.widgets.splice(end, 0, page.widgets.splice(start,1)[0]);
                    page.markModified('widgets');
                    page.save();
                    //console.log(page);
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function removeWidget(widgetId) {
        var deferred = q.defer();

        pageModel
            .findOne({widgets: widgetId}, function (err, page) {
                if(err){
                    deferred.abort(err);
                } else {
                    var ind = page.widgets.indexOf(widgetId);
                    page.widgets.splice(ind,1);
                    page.save();
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function addWidget(pageId, widgetId) {
        var deferred = q.defer();
        pageModel
            .findById(pageId, function (err, page) {
                if(err) {
                    deferred.reject(err);
                } else {
                    page.widgets.push(widgetId);
                    page.save();
                    deferred.resolve(widgetId);
                }
            });
        return deferred.promise;
    }

    function deletePage(pageId) {
        var deferred = q.defer();
        pageModel
            .remove({_id: pageId}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
    function updatePage(pageId, newpage) {
        var deferred = q.defer();
        newpage.lastUpdated = Date.now();
        pageModel
            .update({_id: pageId}, {$set: newpage}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
    function findPageById(pageId) {
        var deferred = q.defer();
        pageModel
            .findById(pageId)
            .populate('_website', '_user')
            .populate('_website._user', 'username')
            .exec(function (err, page) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function findAllPagesForWebsite(websiteId) {
        var deferred = q.defer();
        pageModel
            .find({_website: websiteId})
            .populate({path:'_website', select:'_user',
                populate: {path:'_user', select:'username'}})
            .exec(function (err, pages) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(pages);
                }
            });
        return deferred.promise;
    }

    function createPage(websiteId, page) {
        var deferred = q.defer();
        page._website = websiteId;
        pageModel
            .create(page, function (err, page) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }
};