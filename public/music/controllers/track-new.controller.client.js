(function(){
    angular
        .module("MyMusic")
        .controller("TrackNewController", TrackNewController);

    function TrackNewController(MusicService, UserService, currentUser, $routeParams, $sce) {
        var vm = this;
        vm.test = "hello world";
        vm.track = {};
        // vm.love = false;

        function init() {
            vm.currentUser = currentUser;
            console.log(vm.currentUser);
            UserService.updateCurrentUser(currentUser);

        }
        init();

        //event handlers
        vm.getImage = getImage;
        vm.doYouTrustHTML = doYouTrustHTML;
        vm.wikiToggle = wikiToggle;
        vm.toggleLove = toggleLove;
        vm.addTrack = addTrack;

        function addTrack() {
            if(!vm.track.title) {
                vm.error = "Track Title required.";
                return;
            } else if (!vm.track.url) {
                vm.error = "Please upload a track or enter an external url.";
            }
            else {
                track.artist = vm.currentUser.screenName;
                MusicService
                    .addTrack(vm.track)
                    .then(function (success) {
                        console.log("track added Successfully");
                        vm.success = "Track successfully added.";
                    }, function (err) {
                        vm.error = "Unable to add track. Please try again after sometime";
                    })
            }
        }

        function toggleLove() {
            if(vm.currentUser._id){
                if(vm.love) {
                    UserService
                        .removeTrack(vm.track._id)
                        .then(function (success) {
                            vm.success = "Removed from your favorites";
                            for(var u in vm.track.loves) {
                                if (vm.track.loves[u] == vm.currentUser._id) {
                                    console.log("removeLover");
                                    vm.track.loves.splice(u,1);
                                    vm.track.save();
                                }
                            }
                            vm.love = false;
                        }, function (err) {
                            vm.error = "Unable to remove from favorites. Please try after sometime";
                        });
                } else {
                    UserService
                        .addTrack(vm.track._id)
                        .then(function (success) {
                            vm.success = "Added to your favorites";
                            vm.track.loves.push(vm.currentUser._id);
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
            return track.album.image[2]['#text']?track.album.image[2]['#text']:'../../uploads/default_track.png';
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
