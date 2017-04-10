(function () {
    angular
        .module("MyMusic")
        .controller("ProfileController", ProfileController);
    
    function ProfileController($routeParams, $location, UserService) {
        var vm = this;

        // event handlers
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        var userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }
        init();

        function updateUser(newUser) {
            var promise = UserService.updateUser(userId, newUser);
            promise.success(function (user) {
                if(user != null) {
                    vm.message = "User Successfully Updated!"
                } else {
                    vm.error = "Unable to update user";
                }
            });

        }
        
        function deleteUser() {
            var promise = UserService.deleteUser(userId);
            promise.success(function (success) {
                    $location.url("/login");
            })
                .error(function (error) {
                    vm.error = "Unable to delete user";
                })
        }
    }
})();