(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    
    function WidgetService($http) {

        var globalPageId;
        var api = {
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "createWidget": createWidget,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            "sortWidgets": sortWidgets
        };
        return api;

        function sortWidgets(start, end) {
            var url = '/api/page/PAGEID/widget?initial=INDEX1&final=INDEX2';
            url = url
                .replace('PAGEID', globalPageId)
                .replace('INDEX1', start)
                .replace('INDEX2', end);
            return $http.put(url);
        }
        function deleteWidget(widgetId) {
            return $http.delete('/api/widget/'+widgetId);
        }
        
        function updateWidget(widgetId, widget) {
            return $http.put('/api/widget/'+widgetId, widget);
        }

        function findWidgetById(wgid) {
            return $http.get('/api/widget/'+wgid);
        }

        function findWidgetsByPageId(pageId) {
            globalPageId = pageId;
            return $http.get('/api/page/'+pageId+'/widget');
        }

        function createWidget(pageId, widget) {
            return $http.post('/api/page/'+pageId+'/widget',widget);
        }

    }
})();