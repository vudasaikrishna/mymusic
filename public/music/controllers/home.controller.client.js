(function(){
    angular
        .module("MyMusic")
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteEditController($routeParams, WebsiteService, $location) {
        var vm = this;

        function init() {
            var userId = $routeParams.uid;
            var websiteId = $routeParams.wid;

            WebsiteService.findWebsitesByUser(userId)
                .success(function (sites) {
                    console.log(sites);
                    vm.websites = sites;
                });

            vm.userId = userId;
            WebsiteService
                .findWebsiteById(websiteId)
                .success(function (site) {
                    vm.website =  site;
                })
                .error(function (error) {
                    vm.website = null;
                });
        }
        init();

        // event handlers
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        // delete method
        function deleteWebsite() {
            var promise = WebsiteService.deleteWebsite(vm.website._id);
            promise
                .success(function (success) {
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function (error) {
                    vm.error = "Unable to delete the website";
                });
        }

        // update website method
        function updateWebsite(website) {
            var promise = WebsiteService.updateWebsite(vm.website._id, vm.website);
            promise
                .success(function (success) {
                    vm.message = "Update Successful";
                })
                .error(function (error) {
                    vm.error = "Unable to update the website";
                });
        }
    }
})();
