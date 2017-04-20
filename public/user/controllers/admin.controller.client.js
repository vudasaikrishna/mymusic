(function () {
    angular
        .module('MyMusic')
        .controller('AdminController', adminController);

    function adminController($location, UserService) {
        var model = this;

        model.deleteUser = deleteUser;
        model.updateUser = updateUser;

        function init() {
            UserService.currentMenu.active = "Manage";
            findAllUsers();
        }
        init();
        
        function updateUser(user) {
            UserService
                .updateUser(user)
                .then(findAllUsers);
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(findAllUsers);
        }
        
        function findAllUsers() {
            UserService
                .findAllUsers()
                .then(function (users) {
                    console.log("Done");
                    model.users = users;
                }, function (err) {
                    model.error = err;
                });
        }
    }
})();