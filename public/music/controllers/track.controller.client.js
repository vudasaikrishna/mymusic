(function(){
    angular
        .module("MyMusic")
        .controller("TrackController", TrackController);

    function TrackController(MusicService, $location) {
        var vm = this;
        vm.test = "hello world";
        vm.tracks = [];

        function init() {
            //vm.currentUser = currUser;
            //console.log(vm.currentUser);
            // topTracks();
            if (MusicService.searchKey)
                searchTracks();
            else
                $location.url('/home');
            vm.test = "initialized";
            /*if($location.path() == '/track' && vm.tracks.length == 0)
                $location.url('/home');*/
        }
        init();

        //event handlers
        vm.searchTracks = searchTracks;
        vm.getImage = getImage;

        function searchTracks() {
            vm.searchTerm = MusicService.searchKey;
            console.log(vm.searchTerm);
            vm.test = "searched";
            vm.tracks = [];
            var count  = 0;
            //console.log("Searching for photos");
            // while (vm.tracks.length < 30 && count < 1000) {
                MusicService
                    .searchTracks(vm.searchTerm, ++count)
                    .then(function (response) {
                        //console.log(response);
                        data = response.data;
                        //console.log(data);
                        //data = JSON.parse(data);
                        data = data.results.trackmatches.track;
                        /*for (var t in data) {
                            //console.log(data[t]);
                            //if (data[t].streamable =="FIXME") {
                                console.log("pushed");
                                vm.tracks.push(data[t]);
                            //}
                        }*/
                        /*if(vm.tracks.length >= 30) {

                        } else if (response.data.results['opensearch:totalResults'] <= (count*30)) {
                            break;
                        }*/
                        vm.tracks = data;
                        MusicService.searchTerm = null;
                        //console.log(vm.tracks[0].image[2]);
                    });
            // }
            //$location.url('/track');
        }

        function getImage(track) {
            return track.image[2]['#text']?track.image[2]['#text']:'../../uploads/default_track.png';
        }

        /*function getStreaming(track) {
            if (data[t].streamable['#text']) {
                return data[t].streamable['#text'];
            } else {
            }
        }*/

    }
})();
