(function(){
    angular
        .module("MyMusic")
        .controller("ArtistTrackController", ArtistTrackController);

    function ArtistTrackController(MusicService, UserService, $location) {
        var vm = this;
        vm.tracks = [];

        function init() {
            //vm.currentUser = currUser;
            //console.log(vm.currentUser);
            // topTracks();
            UserService.currentMenu.active = "MyTracks";

            getTracks();
        }
        init();

        //event handlers
        vm.getTracks = getTracks;
        vm.getImage = getImage;

        function getTracks() {
            vm.tracks = [];
                MusicService
                    .findTrackByArtist()
                    .then(function (tracks) {
                        vm.tracks = tracks;
                        console.log(tracks);
                    }, function (err) {
                        vm.error = "Error loading tracks";
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
