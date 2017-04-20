(function(){
    angular
        .module("MyMusic")
        .controller("ArtistTrackController", ArtistTrackController);

    function ArtistTrackController(MusicService, UserService, $routeParams) {
        var vm = this;
        vm.tracks = [];

        function init() {
            vm.currentUser = UserService.currentUser;
            //console.log(vm.currentUser);
            // topTracks();
            UserService.currentMenu.active = "MyTracks";
            var artistId = $routeParams.artistId;
            if(!artistId)
                artistId = vm.currentUser._id;
            getTracks(artistId);
        }
        init();

        //event handlers
        vm.getTracks = getTracks;
        vm.getImage = getImage;

        function getTracks(artistId) {
            vm.tracks = [];
                MusicService
                    .findTrackByArtist(artistId)
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
