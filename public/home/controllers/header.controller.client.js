(function(){
    angular
        .module("MyMusic")
        .controller("HeaderController", HeaderController);

    function HeaderController(UserService, MusicService, $location, $route) {
        var vm = this;
        // vm.test = "hello world";
        vm.currentUser = UserService.currentUser;
        vm.currentMenu = UserService.currentMenu;
        vm.messageCount = UserService.messageCount; // count of unread messages .filter(function(m){return m.read;})
        vm.userMenu = [
            {
                title: "Home",
                url: "#/home",
                current: vm.currentMenu.active == "Home"
            },
            {
                title: "Favorites",
                url: "#/favorite",
                current: vm.currentMenu.active == "Favorites"
            },
            {
                title: "Trending",
                url: "#/trending",
                current: vm.currentMenu.active == "Trending"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: vm.currentMenu.active == "Artists"
            }/*,
            {
                title: "Logout",
                url: "#/logout",
                current: false
            }*/];
        vm.guestMenu = [
            {
                title: "Home",
                url: "#/home",
                current: vm.currentMenu.active == "Home"
            },
            {
                title: "Trending",
                url: "#/trending",
                current: vm.currentMenu.active == "Trending"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: vm.currentMenu.active == "Artists"
            }/*,
            {
                title: "Login",
                url: "#/login",
                current: false
            }*/];

        // m in {true: model.userMenu, false:model.guestMenu}[model.currentUser._id]

        //console.log(vm.currentUser);
        vm.menu = vm.currentUser._id?vm.userMenu:vm.guestMenu;

        function init() {

//            UserService.currentMenu.active = $location.path();
            //vm.test = "initialized";
        }
        init();

        //event handlers
        vm.searchTracks = searchTracks;
        vm.updateUser = updateUser;

        function updateUser() {
            console.log(vm.currentUser);
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    UserService.currentUser.username = null;
                    UserService.currentUser._id = null;
                    UserService.currentUser.photo = null;
                    $location.url('/login');
                });
        }

        function searchTracks() {
            console.log(vm.searchTerm);
            MusicService.searchKey = vm.searchTerm;

            if ($location.path() == '/track') {
                console.log("already on track")
                $route.reload();
            } else
                $location.url('/track');
            // this.$apply();
        }

    }
})();
