(function(){
    angular
        .module("MyMusic")
        .controller("WebsiteNewController", WebsiteNewController);
    
    function WebsiteNewController($routeParams, WebsiteService, $location) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;

        function init() {
            WebsiteService
                .findWebsitesByUser(userId)
                .success(function (sites) {
                    vm.websites = sites;
                });

            vm.userId = userId;
        }
        init();

        // event handlers
        vm.addWebsite = addWebsite;

        // add method
        function addWebsite(website) {
            //console.log(website);
            if (website == null || website.name == null){
                vm.error="Website Name required";
                return;
            }
            var promise = WebsiteService.createWebsite(vm.userId, website);
            promise
                .success(function (status) {
                    vm.message = "Website Added Successfully";
                    //init();
                    $location.url("/user/" + userId + "/website/");
                })
                .error(function (err) {
                    vm.error = "Unable to add website";
                })
        }
    }
})();
