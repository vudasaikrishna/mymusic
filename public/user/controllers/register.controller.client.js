(function () {
    angular
        .module("MyMusic")
        .controller("RegisterController", RegisterController);
    
    function RegisterController($location, UserService) {
        var vm = this;

        // event handlers
        vm.register = register;

        function init() {
        }
        init();

        function register(user) {
            if(user==null) {
                vm.error = "Username required";
                return;
            }
            if(user.password == null){
                vm.error = "Password cannot be empty";
                return;
            }
            if(user.password != user.password2){
                vm.error = "Passwords do not match";
                return;
            }

            console.log(user);
           /* var promise = UserService
                .findUserByUsername(user.username);
            promise
                .success(function (u) {
                    vm.error = "Username already taken";
                })
                .error(function (u) {*/
                    UserService
                        .register(user)
                        .then(function (u) {
                            console.log("recevied success!");
                            if (u){
                                vm.message = "Registered Successfully";
                                $location.url("/profile");
                            } else{
                                vm.error = "Unable to Register";
                            }
                    }, function (err) {
                            vm.error = err;
                        });
               /* });*/
        }
    }
})();