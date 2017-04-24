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
            //console.log(vm.currentUser);
            UserService.updateCurrentUser(currentUser);

            var trackId = $routeParams.tid;
            vm.showWiki = false;
            //console.log(trackId);
            MusicService
                .findTrackById(trackId)
                .then(function (response) {
                    //console.log(track);
                    return response.data;
                }, function (err) {
                    //vm.error = "error loading track from our server.";
                    //console.log(vm.error);
                    return MusicService
                        .findTrackBymbidAPI(trackId)
                        .then(function (response) {
                            data = response.data;
                            vm.track = data.track;
                            //console.log(vm.track);
                            //console.log("track from api.");
                            return MusicService
                                .getTrackInfo(vm.track)
                        }, function (err) {
                            vm.error = "Error loading track from API.";
                            //console.log(vm.error);
                        })
                })
                .then(function (track) {
                    console.log("fetching track from our server");
                    //console.log(track);
                    /*vm.track._id = track._id;
                    vm.track.comments = track.comments;
                    vm.track.loves = track.loves;
                    vm.track.tags = track.tags;
                    vm.track.wiki = track.wiki;
                    */
                    vm.track = track;
                    if(track.title) {
                        vm.track.name = track.title;
                        vm.track.artist = {name: track.artist.screenName};
                        vm.track.image = track.image;
                        vm.track.url = track.url;
                    }
                    if (vm.currentUser._id) {
                        if(vm.currentUser.favorites.find(function (t) {
                                return t == track._id;
                            })) {
                            vm.love = true;
                        }
                    }
                }, function (err) {
                    vm.error = "Error loading track data finally.";
                })
        }
        init();

        //event handlers
        vm.getImage = getImage;
        vm.doYouTrustHTML = doYouTrustHTML;
        vm.wikiToggle = wikiToggle;
        vm.toggleLove = toggleLove;
        vm.addComment = addComment;

        function addComment() {
            if(!vm.comment) {
                return;
            } else if (!vm.currentUser._id) {
                vm.error = "Please login to use this feature.";
            }
            else {
                var comment = {
                    comment: vm.comment,
                    user: currentUser._id,
                    createdDate: Date.now()
                }
                MusicService
                    .addComment(comment, vm.track._id)
                    .then(function (success) {
                        comment.user = {
                            _id: currentUser._id,
                            firstName: currentUser.firstName
                        }
                        vm.track.comments.push(comment);
                        vm.comment = "";
                        //console.log("Comment Successful");
                    }, function (err) {
                        vm.error = "Unable to add comment. Please try again after sometime";
                    })
            }
        }

        function toggleLove() {
            if(vm.currentUser._id){
                if(vm.love) {
                    console.log(vm.track._id);
                    UserService
                        .removeTrack(vm.track._id)
                        .then(function (success) {
                            vm.success = "Removed from your favorites";
                            for(var u in vm.track.loves) {
                                if (vm.track.loves[u] == vm.currentUser._id) {
                                    //console.log("removeLover");
                                    vm.track.loves.splice(u,1);
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
            //console.log(track);
            if(track.image)
                return track.image;
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
