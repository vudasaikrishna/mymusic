(function(){
    angular
        .module("MyMusic")
        .controller("ArtistTrackController", ArtistTrackController);

    function ArtistTrackController(MusicService, UserService, $routeParams) {
        var vm = this;
        vm.tracks = [];

        function init() {
            vm.loading = true;
            vm.currentUser = UserService.currentUser;
            vm.artist = vm.currentUser.role=="ARTIST";
            //console.log(vm.currentUser);
            // topTracks();
            if(!vm.currentUser.role=='ARTIST')
                UserService.currentMenu.active = "Artists";
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
                        // console.log(tracks);
                        vm.loading = false;
                    }, function (err) {
                        vm.error = "Error loading tracks";
                        vm.loading = false;
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
