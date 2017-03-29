(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController);
    
    function loginController($location, UserService) {
        var vm = this;

        // event handlers
        vm.login = login;

        function init() {
        }
        init();

        function login(user) {
            if(user==null) {
                vm.error = "Username required"
                return;
            }
            if(user.password == null){
                vm.error = "Password cannot be empty"
                return;
            }
            var promise = UserService
                .findUserByCredentials(user.username, user.password);
            promise.success(function (user) {
                if(user) {
                    $location.url("/user/"+user._id);
                } else {
                    vm.error = "User not found";
                }
            })
                .error(function (err) {
                    vm.error = "User not found";
                });
        }
    }
})();