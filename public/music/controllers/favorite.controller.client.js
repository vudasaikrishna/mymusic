(function(){
    angular
        .module("MyMusic")
        .controller("FavoriteController", FavoriteController);

    function FavoriteController(currentUser, MusicService, UserService, $location, $routeParams, $sce) {
        var vm = this;
        vm.test = "hello world";
        vm.track = {};
        // vm.love = false;

        function init() {
            vm.currentUser = currentUser;
            console.log(vm.currentUser);
            UserService.currentMenu.active = "Favorites";
            UserService
                .getFavorites()
                .then(function (favorites) {
                    console.log(favorites);
                    vm.favorites = favorites;
                }, function (err) {
                    vm.error = "Error loading favorites";
                })
        }
        init();

        //event handlers
        vm.getImage = getImage;
        vm.doYouTrustHTML = doYouTrustHTML;
        vm.wikiToggle = wikiToggle;
        vm.unLove = unLove;

        function unLove(trackId) {
            if(vm.currentUser._id){
                UserService
                    .removeTrack(trackId)
                    .then(function (user) {
                        vm.success = "Removed from your favorites";
                        console.log(trackId);
                        console.log(vm.favorites[0]._id);
                        for(var t in vm.favorites) {
                            if (vm.favorites[t]._id == trackId) {
                                console.log("removeFavorite");
                                vm.favorites.splice(t,1);
                            }
                        }
                    }, function (err) {
                        vm.error = "Unable to remove from favorites. Please try after sometime";
                    });
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
