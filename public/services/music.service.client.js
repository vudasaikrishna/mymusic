(function () {
    //console.log("Service loaded");
    angular
        .module("MyMusic")
        .factory("MusicService", MusicService);

    function MusicService($http) {

        // Last.Fm API
        // API KEy and Secret
        var key = /*process.env.API_KEY ||*/ "82d41887eded3508556137889b65f14e";
        var secret = /*process.env.API_SECRET// ||*/ "fb228a0b77eec1eed2c24ff9a6f5cee8";
        var urlBase = "http://ws.audioscrobbler.com/2.0/?method=METHOD&PARAMS&api_key=API_KEY&format=json";

        var searchKey = null;

        /*// Musikki API
        var key = "c3d9202718f7d6ba72e6acbe806edd79";
        var appId = "f15ceff588f3a963e98c7e93b27e485a";
        var host = "music-api.musikki.com";
        var base = "/genres/?q=[genre-name:rock]";*/
        //console.log(urlBase);
        var api = {
            "searchMusic": searchMusic,
            "searchTracks": searchTracks,
            "getMoods": getMoods,
            "topTracks": topTracks,
            "searchKey": searchKey,
            "findTrackById":findTrackById,
            "getTrackInfo": getTrackInfo,
            "addComment": addComment
        };
        return api;

        /*
        * http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=disco&api_key=YOUR_API_KEY&format=json
        * mood based top charts
        * */

        function addComment(comment, trackId) {
            return $http.post('/api/track/'+trackId+'/addComment',comment)
                .then(function (response) {
                    return response.data;
                });
        }

        function getTrackInfo(track) {
            track = {
                mbid: track.mbid,
                title: track.name,
                artist: track.artist.name,
                url: track.url,
                image: track.album.image[3]['#text']
            }
            //console.log(track);
            return $http.post('/api/track',track)
                .then(function (response) {
                    return response.data;
                });
        }

        function findTrackById(trackId) {
            var method = "track.getInfo";
            var params = "mbid="+trackId;
            var url = urlBase
                .replace("API_KEY", key)
                .replace("METHOD", method)
                .replace("PARAMS", params);
            return $http.get(url);
        }

        function getMoods() {
            var url = urlBase.replace("API_KEY", key);
        }

        function topTracks() {
            var urlBase = "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=disco&api_key=API_KEY&format=json";
            var url = urlBase.replace("API_KEY", key);
            return $http.get(url);
        }

        function searchTracks(searchTerm, page) {
            //console.log(urlBase);
            //console.log(page);
            var method = "track.search";
            var params = "track="+searchTerm+"&page="+page;
            var url = urlBase
                .replace("API_KEY", key)
                .replace("METHOD", method)
                .replace("PARAMS", params);
            return $http.get(url);
        }

        function searchMusic(searchTerm) {
            //console.log(urlBase);
            // search tracks, artists and albums.
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }


    }
})();

