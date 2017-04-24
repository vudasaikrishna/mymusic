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

        var api = {
            "searchTracks": searchTracks,
            "getMoods": getMoods,
            "topTracks": topTracks,
            "searchKey": searchKey,
            "findTrackBymbidAPI": findTrackBymbidAPI,
            "findTrackById":findTrackById,
            "getTrackInfo": getTrackInfo,
            "addComment": addComment,
            "findTrackByArtist": findTrackByArtist,
            "findTrackBymbid": findTrackBymbid
        };
        return api;

        /*
        * http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=disco&api_key=YOUR_API_KEY&format=json
        * mood based top charts
        * */

        function findTrackById(trackId) {
            return $http.get('/api/track/'+trackId);
        }


        function findTrackByArtist(artistId) {
            return $http.get('/api/artistTrack/'+artistId)
                .then(function (response) {
                    return response.data;
                });
        }

        function addComment(comment, trackId) {
            return $http.post('/api/track/'+trackId+'/addComment',comment)
                .then(function (response) {
                    return response.data;
                });
        }

        function getTrackInfo(track) {
            var tags = [];
            // console.log(track.toptags.tag);
            for(var i in track.toptags.tag) {
                //console.log(track.toptags.tag[i].name);
                tags.push(track.toptags.tag[i].name);
            }
            var wiki;
            if(track.wiki) {
                wiki = {
                    summary: track.wiki.summary,
                    published: track.wiki.published
                }
            }
            // console.log(tags);
            track = {
                mbid: track.mbid,
                title: track.name,
                artist: track.artist.name,
                url: track.url,
                image: track.album.image[3]['#text'],
                tags: tags,
                playCount: track.playcount,
                listenersCount: track.listeners,
                wiki: wiki
            };
            //console.log(track);
            return $http.post('/api/track',track)
                .then(function (response) {
                    return response.data;
                });
        }

        function findTrackBymbid(mbid) {
            return $http.get('/api/track/mbid='+mbid)
                .then(function (response) {
                    return response.data;
                });
        }

        function findTrackBymbidAPI(trackId) {
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

    }
})();

