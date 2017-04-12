(function () {
    //console.log("Service loaded");
    angular
        .module("MyMusic")
        .factory("MusicService", MusicService);

    function MusicService($http) {

        // Last.Fm API
        var key = "82d41887eded3508556137889b65f14e";
        var secret = "fb228a0b77eec1eed2c24ff9a6f5cee8";
        var urlBase = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=TEXT&api_key=API_KEY&format=json";


        /*// Musikki API
        var key = "c3d9202718f7d6ba72e6acbe806edd79";
        var appId = "f15ceff588f3a963e98c7e93b27e485a";
        var host = "music-api.musikki.com";
        var base = "/genres/?q=[genre-name:rock]";*/
        //console.log(urlBase);
        var api = {
            "searchMusic": searchMusic,
            "getMoods": getMoods
        };
        return api;

        function getMoods() {
            var url = urlBase.replace("API_KEY", key).replace()
        }
        function searchMusic(searchTerm) {
            //console.log(urlBase);
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }


    }
})();

