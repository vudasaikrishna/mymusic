(function () {
    angular
        .module("WebAppMaker")
        .service("PageService", PageService);

    function PageService($http) {

        // TODO: complete website crud functions

        var api = {
            findPageByWebsiteId: findPageByWebsiteId,
            findPageById: findPageById,
            createPage: createPage,
            updatePage: updatePage,
            deletePage: deletePage
        };
        return api;
        
        function deletePage(pageId) {
            return $http.delete('/api/page/'+pageId);
        }

        function updatePage(pageId, page) {
            return $http.put('/api/page/'+pageId, page);
        }

        function createPage(websiteId, page) {
            return $http.post('/api/website/'+websiteId+'/page', page);
        }

        function findPageById(pageId) {
            return $http.get('/api/page/'+pageId);
        }

        function findPageByWebsiteId(websiteId) {
            return $http.get('/api/website/'+websiteId+'/page');
        }
    }
})();