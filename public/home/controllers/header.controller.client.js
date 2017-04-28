(function(){
    angular
        .module("MyMusic")
        .controller("HeaderController", HeaderController);

    function HeaderController(UserService, MusicService, $location, $window, $route) {
        var vm = this;
        // vm.test = "hello world";
        vm.currentUser = UserService.currentUser;
        vm.currentMenu = UserService.currentMenu;
        vm.messageCount = UserService.messageCount; // count of unread messages .filter(function(m){return m.read;})
        vm.userMenu = [
            {
                title: "Home",
                url: "#/home",
                show: true,
                current: vm.currentMenu.active == "Home"
            },
            {
                title: "Favorites",
                url: "#/favorite",
                show: true,
                current: vm.currentMenu.active == "Favorites"
            },
            {
                title: "Artists",
                url: "#/artist",
                show: true,
                current: vm.currentMenu.active == "Artists"
            }/*,
            {
                title: "Logout",
                url: "#/logout",
                current: false
            }*/];
        vm.adminMenu = [
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
                title: "Manage",
                url: "#/admin",
                current: vm.currentMenu.active == "Manage"
            },
            {
                title: "Artists",
                url: "#/artist",
                show: true,
                current: vm.currentMenu.active == "Artists"
            }];
        vm.artistMenu = [
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
                title: "MyTracks",
                url: "#/mytracks",
                current: vm.currentMenu.active == "MyTracks"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: vm.currentMenu.active == "Artists"
            }];
        vm.guestMenu = [
            {
                title: "Home",
                url: "#/home",
                current: vm.currentMenu.active == "Home"
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
        vm.backButton = backButton

        function backButton() {
            /*$window.history.back();
            return;*/
            var path = $location.path();
            if(path == '/register') {
                $location.url('/login');
            } else if(path.indexOf('/artist/')!=-1) {
                $location.url('/artist');
            } else if(path.indexOf('/track/')!=-1) {
                $location.url('/track');
            } else {
                $location.url('/home');
            }

            /*switch (path) {
                case '/track':
                    $location.url('/home');
                    break;
                case '/artist':
                    $location.url('/home');
                    break;
                case '/favorite':
                    $location.url('/home');
                    break;
                case '/mytracks':
                    $location.url('/home');
                    break;
                case '/admin':
                    $location.url('/home');
                    break;
                case '/track/':
                    $location.url('/track');
                    break;
                case '/artist/':
                    $location.url('/artist');
                    break;
                case '/login':
                    $location.url('/home');
                    break;
                case '/register':
                    $location.url('/login');
                    break;
                case '/messages':
                    $location.url('/home');
                    break;
                default:
                    $location.url('/home');
                    break;
            }*/
        }

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
