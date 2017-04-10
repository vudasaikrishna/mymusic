(function(){
    angular
        .module("MyMusic")
        .controller("PageListController", PageListController);
    
    function PageListController($routeParams, PageService) {
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var vm = this;

        function init() {
            vm.websiteId = websiteId;
            vm.userId = userId;

            PageService
                .findPageByWebsiteId(websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                    //console.log(pages)
                });
        }
        init();
    }
})();
