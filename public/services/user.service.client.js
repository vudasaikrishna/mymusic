(function () {
    angular
        .module("MyMusic")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "findUserByUsername": findUserByUsername,
            "findUserById": findUserById,
            "updateUser": updateUser,
            "createUser": createUser,
            "deleteUser": deleteUser
        };
        return api;

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }

        function findUserByUsername(username){
            return $http.get("/api/user?username="+username);
        }

        function createUser(user) {
            return $http.post("/api/user", user);
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