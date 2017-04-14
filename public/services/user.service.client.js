(function () {
    angular
        .module("MyMusic")
        .factory("UserService", userService);

    function userService($http) {

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
            "updateUser": updateUser
        };
        return api;

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