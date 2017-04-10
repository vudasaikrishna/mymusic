(function(){
    angular
        .module("MyMusic")
        .controller("PageEditController", PageEditController);
    
    function PageEditController($routeParams, PageService, $location) {
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        var vm = this;

        // event handlers
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.pageId = pageId;
            vm.websiteId = websiteId;
            vm.userId = userId;

            PageService
                .findPageByWebsiteId(websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                });

            PageService
                .findPageById(pageId)
                .success(function (page) {
                    vm.page = page;
                });
        }
        init();

        // delete method
        function deletePage() {
            var promise = PageService.deletePage(pageId);
            promise
                .success(function (success) {
                    $location.url('/user/'+userId+'/website/'+websiteId+'/page');
                })
                .error(function (error) {
                    vm.error = "Unable to delete the page";
                });
        }

        // update website method
        function updatePage(page) {
            var promise = PageService.updatePage(pageId, page);
            promise
                .success(function (success) {
                    vm.message = "Updated Successfully";
                })
                .error(function (error) {
                    vm.error = "Unable to update the page";
                });
        }
    }
})();
