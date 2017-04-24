(function () {
    angular
        .module("MyMusic")
        .factory("UserService", userService);

    function userService($http) {

        var currentUser = {messages:[]};
        var currentMenu = {};
        var messageCount = {};

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "findUserByUsername": findUserByUsername,
            "findUserByScreenName": findUserByScreenName,
            "findUserById": findUserById,
            "findAllArtists": findAllArtists,
            "updateProfile": updateProfile,
            "register": register,
            "deleteUser": deleteUser,
            "login": login,
            "loggedin": loggedin,
            "logout": logout,
            "isAdmin": isAdmin,
            "isArtist": isArtist,
            "findAllUsers": findAllUsers,
            "updateUser": updateUser,
            "currentUser": currentUser,
            "currentMenu": currentMenu,
            "messageCount": messageCount,
            "addTrack": addTrack,
            "removeTrack": removeTrack,
            "getFavorites": getFavorites,
            "updateCurrentUser": updateCurrentUser,
            "searchUsers": searchUsers,
            "addMessage": addMessage,
            "removeMessage": removeMessage,
            "getMessages": getMessages
        };
        return api;

        function findUserByScreenName(screenName) {
                return $http.get("/api/user?screenName="+screenName)
                    .then(function (response) {
                        return response.data;
                    }, function (err) {
                        console.log(err);
                    })
        }

        function findAllArtists() {
            return $http.get('/api/artist');
        }

        function getMessages() {
            return $http.get('/api/user/message')
                .then(function (response) {
                    return response.data;
                });
        }

        function removeMessage(userId, message) {
            return $http.post('/api/user/'+userId+'/removeMessage', message)
                .then(function (response) {
                    return response.data;
                });
        }

        function addMessage(userId, message) {
            return $http.post('/api/user/'+userId+'/addMessage', message)
                .then(function (response) {
                    return response.data;
                });
        }

        function searchUsers(searchTerm) {
            return $http.post('/api/user/search?key='+searchTerm)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateCurrentUser(currUser) {
            if(currUser._id){
                currentUser.username = currUser.username;
                currentUser.firstName = currUser.firstName;
                currentUser._id = currUser._id;
                currentUser.photo = currUser.photo;
                currentUser.role = currUser.role;
                currentUser.messages = currUser.messages;
                messageCount.value = currentUser.messages.filter(function(m){return !m.read;}).length;
            } else {
                currentUser.username = null;
                currentUser.firstName = null;
                currentUser._id = null;
                currentUser.photo = null;
                currentUser.role = null;
                currentUser.messages = null;
                messageCount.value = null;
            }
        }

        function getFavorites() {
            return $http.get('/api/user/favorite')
                .then(function (response) {
                    return response.data;
                });
        }

        function removeTrack(trackId) {
            return $http.post('/api/user/removetrack/'+trackId)
                .then(function (response) {
                    return response.data;
                });
        }

        function addTrack(trackId) {
            return $http.post('/api/user/addtrack/'+trackId)
                .then(function (response) {
                    return response.data;
                });
        }

        function logout() {
            return $http.post('/api/logout')
                .then(function (response) {
                    return response.data;
                });
        }

        function loggedin() {
            return $http.post('/api/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }

        function login(user) {
            return $http.post('/api/login', user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllUsers() {
            return $http.get('/api/user/all')
                .then(function (response) {
                    return response.data;
                });
        }

        function isAdmin() {
            return $http.post('/api/isAdmin')
                .then(function (response) {
                    return response.data;
                });
        }

        function isArtist() {
            return $http.post('/api/isArtist')
                .then(function (response) {
                    return response.data;
                });
        }

        function updateProfile(user) {
            return $http.put('/api/profile/' + user._id, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }

        function findUserByUsername(username){
            return $http.get("/api/user?username="+username);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/user/"+userId, newUser);
        }
        
        function findUserById(userId) {
            return $http.get("/api/user/"+userId);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }
    }
})();