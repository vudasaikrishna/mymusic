(function () {
    //console.log("Service loaded");
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    function FlickrService($http) {

        var key = "fcceb3463e8b34fb867510053788e699";
        var secret = "2a5c7d62782b85b6";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        //console.log(urlBase);
        var api = {
            "searchPhotos": searchPhotos
        };
        return api;
        function searchPhotos(searchTerm) {
            //console.log(urlBase);
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }


    }
})();
