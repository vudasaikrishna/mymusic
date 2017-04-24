(function(){
    angular
        .module("MyMusic")
        .controller("TrackListController", TrackListController);

    function TrackListController(MusicService, $location) {
        var vm = this;
        vm.tracks = [];

        function init() {
            //vm.currentUser = currUser;
            //console.log(vm.currentUser);
            // topTracks();
            if (MusicService.searchKey)
                searchTracks();
            else
                $location.url('/home');
        }
        init();

        //event handlers
        vm.searchTracks = searchTracks;
        vm.getImage = getImage;

        function searchTracks() {
            vm.loading = true;
            vm.searchTerm = MusicService.searchKey;
            // console.log(vm.searchTerm);
            vm.tracks = [];
            var count = 0;
            MusicService
                .searchTracks(vm.searchTerm, ++count)
                .then(function (response) {
                    data = response.data;

                    data = data.results.trackmatches.track;
                    for (var t in data) {
                        if (data[t].mbid!="") {
                            //console.log("pushed");
                            vm.tracks.push(data[t]);
                        }
                    }
                    vm.loading = false;
                    if (vm.tracks.length == 0) {
                        vm.error = "No tracks found for the search criteria."
                    }
                });
        }

        function getImage(track) {
            return track.image[2]['#text']?track.image[2]['#text']:'../../uploads/default_track.png';
        }

    }
})();
