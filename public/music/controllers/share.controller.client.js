(function(){
    angular
        .module("MyMusic")
        .controller("ShareController", ShareController);

    function ShareController(UserService, currentUser, $routeParams) {
        var vm = this;
        vm.test = "hello world";
        vm.track = {};

        function init() {
            vm.currentUser = currentUser;
            console.log(vm.currentUser);
            UserService.updateCurrentUser(currentUser);

            vm.trackId = $routeParams.tid;
        }
        init();

        //event handlers
        vm.searchUsers = searchUsers;
        vm.shareWithUser = shareWithUser;

        function shareWithUser(user) {
            console.log(user);
            var message = {
                track: vm.trackId,
                user: currentUser._id
            };
            UserService
                .addMessage(user._id, message)
                .then(function (success) {
                    if (user.lastName)
                        var name = user.firstName+" "+user.lastName;
                    else
                        var name = user.firstName;
                    vm.success = "Track successfully shared with "+ name;                    vm.users = null;
                }, function (err) {
                    vm.error = "Error sharing track. Please try after sometime."
                })
        }

        function searchUsers() {
            UserService
                .searchUsers(vm.searchTerm)
                .then(function (users) {
                    console.log(users);
                    if(users.length == 0) {
                        vm.users = null;
                        vm.error = "No users found matching the search. Please try using fewer characters."
                    } else {
                        vm.error = null;
                        vm.users = users;
                    }
                }, function (err) {
                    vm.error = "Unable to search the users. Please try after sometime";
                });
        }
    }

})();
