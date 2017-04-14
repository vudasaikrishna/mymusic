(function () {
    angular
        .module("MyMusic")
        .controller("ProfileController", ProfileController);
    
    function ProfileController(currentUser, $location, UserService) {
        var vm = this;

        // event handlers
        vm.updateProfile = updateProfile;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        vm.getPhoto = getPhoto;

        function init() {
            /*var promise = UserService.findUserById(userId);
            promise.success(function (user) {
                vm.user = user;
            });*/
            vm.currentUser = currentUser;
            vm.user = currentUser;
            var userId = vm.currentUser._id;
        }
        init();

        function getPhoto() {
            if (vm.user){
                return vm.user.photo;
            }else {
                return "uploads/default-profile.png";
            }
        }

        function updateProfile(user) {
            UserService
                .updateProfile(user)
                .then(function () {
                    vm.message = "User Successfully Updated!"
                }, function (err) {
                    vm.error = "Unable to update user";
                });

        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/login');
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