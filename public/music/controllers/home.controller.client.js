(function(){
    angular
        .module("MyMusic")
        .controller("MoodController", MoodController);

    function MoodController($routeParams, MusicService, $location) {
        var vm = this;
        vm.test = "hello world";
        vm.tracks = [];

        //console.log("Mood");
        /*vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.wgId = $routeParams.wgid;*/

        function init() {
            /*WidgetService
                .findWidgetById(vm.wgId)
                .success(function (widget) {
                    vm.widget = widget;
                });*/
            vm.test = "initialized";
        }
        init();

        //event handlers
        vm.searchTracks = searchTracks;


        function searchTracks(searchTerm) {
            //console.log(searchTerm);
            vm.test = "searched";
            var count  = 0;
            //console.log("Searching for photos");
            // while (vm.tracks.length < 30 && count < 1000) {
                MusicService
                    .searchTracks(searchTerm, ++count)
                    .then(function (response) {
                        //console.log(response);
                        data = response.data;
                        //console.log(data);
                        //data = JSON.parse(data);
                        data = data.results.trackmatches.track;
                        for (var t in data) {
                            //console.log(data[t]);
                            if (data[t].streamable =="FIXME") {
                                console.log("pushed");
                                vm.tracks.push(data[t]);
                            }
                        }
                        /*if(vm.tracks.length >= 30) {

                        } else if (response.data.results['opensearch:totalResults'] <= (count*30)) {
                            break;
                        }*/
                        //vm.tracks = data;
                        //console.log(vm.tracks[0].image[2]);
                    });
            // }
            $location.url('/track');
        }

        /*function selectPhoto(photo) {
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
        }*/
    }
})();
