(function () {
    //console.log("Service loaded");
    angular
        .module("MyMusic")
        .factory("MusicService", MusicService);

    function MusicService($http) {

        // Last.Fm API
        var key = /*process.env.API_KEY ||*/ "82d41887eded3508556137889b65f14e";
        var secret = /*process.env.API_SECRET// ||*/ "fb228a0b77eec1eed2c24ff9a6f5cee8";
        var urlBase = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=TEXT&page=PAGE&api_key=API_KEY&format=json";


        /*// Musikki API
        var key = "c3d9202718f7d6ba72e6acbe806edd79";
        var appId = "f15ceff588f3a963e98c7e93b27e485a";
        var host = "music-api.musikki.com";
        var base = "/genres/?q=[genre-name:rock]";*/
        //console.log(urlBase);
        var api = {
            "searchMusic": searchMusic,
            "searchTracks": searchTracks,
            "getMoods": getMoods
        };
        return api;

        /*
        * http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=disco&api_key=YOUR_API_KEY&format=json
        * mood based top charts
        * */
        function getMoods() {
            var url = urlBase.replace("API_KEY", key);
        }

        function searchTracks(searchTerm, page) {
            //console.log(urlBase);
            console.log(page);
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm).replace("PAGE", page);
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

