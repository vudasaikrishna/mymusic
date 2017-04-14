(function () {
    angular
        .module("MyMusic")
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
            UserService
                .login(user)
                .then(function (user) {
                    if(user) {
                    $location.url("/profile");
                } else {
                    vm.error = "User not found";
                }
            }, function (err) {
                    vm.error = "User not found";
                });
        }
    }
})();