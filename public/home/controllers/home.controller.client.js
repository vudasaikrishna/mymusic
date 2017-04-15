(function(){
    angular
        .module("MyMusic")
        .controller("HomeController", HomeController);

    function HomeController(MusicService, $location) {
        var vm = this;
        vm.searchTerm = "";

        function init() {
            //vm.currentUser = currUser;
            //console.log(vm.currentUser);
            vm.test = "initialized";
            //vm.tracks = MusicService.tracks;
            if(MusicService.searchKey)
                /*searchTracks();*/
                MusicService.searchKey = null;

            topTracks();
        }
        init();

        //event handlers
        vm.getImage = getImage;
        vm.topTracks = topTracks;

        function topTracks() {
            // MusicService.setTracks([]);
            vm.tracks = [];
            vm.test = "Top Tracks";
            MusicService
                .topTracks()
                .then(function (response) {
                    //console.log(response);
                    data = response.data;
                    //console.log(data);
                    //data = JSON.parse(data);
                    data = data.tracks.track;
                    vm.tracks = data;
                });
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
