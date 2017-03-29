(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebSiteListController);
    
    function WebSiteListController($routeParams, WebsiteService) {
        var vm = this;

        function init() {
            var userId = $routeParams.uid;
            WebsiteService.findWebsitesByUser(userId)
                .success(function (sites) {
                    //console.log(sites);
                    vm.websites = sites;
                });

            vm.userId = userId;
        }
        init();

    }
})();
