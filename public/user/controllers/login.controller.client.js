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
                        if(user.role == 'ARTIST')
                            $location.url("/mytracks");
                        else if(user.role == 'ADMIN')
                            $location.url("/admin");
                        else
                            $location.url("/favorite");
                } else {
                    vm.error = "Username or Password is invalid";
                }
            }, function (err) {
                    vm.error = "Username or Password is invalid";
                });
        }
    }
})();