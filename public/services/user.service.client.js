(function () {
    angular
        .module("MyMusic")
        .factory("UserService", userService);

    function userService($http) {

        var currentUser = {};

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "findUserByUsername": findUserByUsername,
            "findUserById": findUserById,
            "updateProfile": updateProfile,
            "register": register,
            "deleteUser": deleteUser,
            "login": login,
            "loggedin": loggedin,
            "logout": logout,
            "isAdmin": isAdmin,
            "findAllUsers": findAllUsers,
            "updateUser": updateUser,
            "currentUser": currentUser,
            "addTrack": addTrack,
            "removeTrack": removeTrack,
            "getFavorites": getFavorites,
            "updateCurrentUser": updateCurrentUser
        };
        return api;

        function updateCurrentUser(currUser) {
            if(currUser._id){
                currentUser.username = currUser.username;
                currentUser.firstName = currUser.firstName;
                currentUser._id = currUser._id;
                currentUser.photo = currUser.photo;
            } else {
                currentUser.username = null;
                currentUser.firstName = null;
                currentUser._id = null;
                currentUser.photo = null;
            }
        }

        function getFavorites() {
            return $http.post('/api/user/favorite')
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
            return $http.get('/api/user')
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