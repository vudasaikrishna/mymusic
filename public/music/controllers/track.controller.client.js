(function(){
    angular
        .module("MyMusic")
        .controller("TrackController", TrackController);

    function TrackController(MusicService, UserService, currentUser, $routeParams, $sce) {
        var vm = this;
        vm.test = "hello world";
        vm.track = {};
        // vm.love = false;

        function init() {
            vm.currentUser = currentUser;
            console.log(vm.currentUser);
            UserService.updateCurrentUser(currentUser);

            var trackId = $routeParams.tid;
            vm.showWiki = false;
            //console.log(trackId);
            MusicService
                .findTrackById(trackId)
                .then(function (response) {
                    data = response.data;
                    vm.track = data.track;
                    //console.log(vm.track);
                    console.log("track from api.");
                    return MusicService
                        .getTrackInfo(vm.track)
                }, function (err) {
                    vm.error = "Error loading track data";
                })
                .then(function (track) {
                    console.log("fetching track id...");
                    console.log(track._id);
                    vm.track._id = track._id;
                    if (vm.currentUser._id) {
                        if(vm.currentUser.favorites.find(function (t) {
                                return t == track._id;
                            })) {
                            vm.love = true;
                        }
                    }
                }, function (err) {
                    vm.error = "Error loading track data";
                })
        }
        init();

        //event handlers
        vm.getImage = getImage;
        vm.doYouTrustHTML = doYouTrustHTML;
        vm.wikiToggle = wikiToggle;
        vm.toggleLove = toggleLove;

        function toggleLove() {
            if(vm.currentUser._id){
                if(vm.love) {
                    UserService
                        .removeTrack(vm.track._id)
                        .then(function (success) {
                            vm.success = "Removed from your favorites";
                            vm.love = false;
                        }, function (err) {
                            vm.error = "Unable to remove from favorites. Please try after sometime";
                        });
                } else {
                    UserService
                        .addTrack(vm.track._id)
                        .then(function (success) {
                            vm.success = "Added to your favorites";
                            vm.love = true;
                        }, function (err) {
                            vm.error = "Unable to add to favorites. Please try after sometime";
                        });
                }
            } else {
                vm.error = "Please login to use this feature.";
            }

        }

        function wikiToggle() {
            vm.showWiki = !vm.showWiki;
        }

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
                        //MusicService.searchTerm = null;
                        //console.log(vm.tracks[0].image[2]);
                    });
            // }
            //$location.url('/track');
        }

        function getImage(track) {
            if(!track.name)
                return '../../uploads/default_track.png';
            return track.album.image[3]['#text']?track.album.image[3]['#text']:'../../uploads/default_track.png';
        }

        function doYouTrustHTML(text) {
            if(!text)
                return;
            text = text.replace("Read more on Last.fm.","Read more");
            text = text.replace("href", "target='_blank' href");
            //console.log(text);
            return $sce.trustAsHtml(text);
        }
    }
})();
