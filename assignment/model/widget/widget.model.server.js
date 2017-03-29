module.exports = function () {

    var q = require('q');
    var mongoose = require('mongoose');

    var widgetSchema = require('./widget.schema.server.js')();
    var widgetModel = mongoose.model('AssignmentWidget', widgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget
        //reorderWidget: reorderWidget
    };
    return api;

    function reorderWidget(pageId, start, end) {
    // page.markModified('widget');
        // moved to page Model.
    }

    function deleteWidget(widgetId) {
        var deferred = q.defer();
        widgetModel
            .remove({_id: widgetId}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    function updateWidget(widgetId, newwidget) {
        var deferred = q.defer();
        widgetModel
            .update({_id: widgetId}, {$set: newwidget}, function (err, status) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    function findWidgetById(widgetId) {
        var deferred = q.defer();
        widgetModel
            .findById(widgetId, function (err, widget) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(widget);
                }
            });
        return deferred.promise;
    }
    function findAllWidgetsForPage(pageId) {
        var deferred = q.defer();
        widgetModel
            .find({_page: pageId}, function (err, widgets) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(widgets);
                }
            });
        return deferred.promise;
    }

    function createWidget(pageId, widget) {
        var deferred = q.defer();
        widget._page = pageId;
        widgetModel
            .create(widget, function (err, widget) {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(widget);
                }
            });
        return deferred.promise;
    }
};