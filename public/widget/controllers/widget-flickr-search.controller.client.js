(function () {
    //console.log("Controller loaded");
    angular
        .module("MyMusic")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    function FlickrImageSearchController($routeParams, FlickrService, WidgetService, $location) {
        var vm = this;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.wgId = $routeParams.wgid;

        function init() {
            WidgetService
                .findWidgetById(vm.wgId)
                .success(function (widget) {
                    vm.widget = widget;
                });
        }
        init();

        //event handlers
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function searchPhotos(searchTerm) {
            //console.log("Searching for photos");
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });

        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            vm.widget.url = url;
            console.log(url);
            WidgetService
                .updateWidget(vm.wgId, vm.widget)
                .then(function (response) {
                    //console.log([vm.userId, vm.websiteId, vm.pageId, vm.wgId]);
                    $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget/'+vm.wgId);
                }, function (err) {
                    vm.error = "Unable to add Image";
                });
        }
    }
})();
