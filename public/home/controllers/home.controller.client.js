(function(){
    angular
        .module("MyMusic")
        .controller("HomeController", HomeController);

    function HomeController(currUser, MusicService, $location, UserService) {
        var vm = this;
        vm.searchTerm = "";

        function init() {
            //vm.currentUser = currUser;
            //console.log(vm.currentUser);
            //vm.test = "initialized";
            // Saving user data for Header
            UserService.updateCurrentUser(currUser);
            UserService.currentMenu.active = "Home";
            //console.log(UserService.currentUser);

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
        vm.viewArtist = viewArtist;

        function viewArtist(track) {

            MusicService
                .findTrackById(track.mbid)
                .then(function (response) {
                    //console.log(track);
                    return response.data;
                }, function (err) {
                    //vm.error = "error loading track from our server.";
                    //console.log(vm.error);
                    return MusicService
                        .findTrackBymbidAPI(track.mbid)
                        .then(function (response) {
                            data = response.data;
                            vm.track = data.track;
                            //console.log(vm.track);
                            //console.log("track from api.");
                            return MusicService
                                .getTrackInfo(vm.track)
                        }, function (err) {
                            vm.error = "Error loading artist";
                            //console.log(vm.error);
                        })
                })
                .then(function (track) {
                    vm.track._id = track._id;
                    $location.url('/artist/'+track.artist);
                }, function (err) {
                    vm.error = "Error loading artist data finally.";
                })
        }
        /*function viewArtist(track) {
            console.log(track);
            track.album = {image: track.image};
            UserService
                .findUserByScreenName(track.artist.name)
                .then(function (artist) {
                    console.log(artist);
                    if(artist) {
                        console.log(artist);
                        $location.url('/artist/'+artist._id);
                    } else {
                        MusicService
                            .getTrackInfo(track)
                            .then(function (track) {
                                console.log(track);
                                $location.url('/artist/'+track.artist);
                            }, function (err) {
                                console.log(err);
                            })
                    }
                }, function (err) {
                    console.log(err);
                })
        }*/

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
