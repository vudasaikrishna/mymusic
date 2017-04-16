(function(){
    angular
        .module("MyMusic")
        .controller("HeaderController", HeaderController);

    function HeaderController(UserService, MusicService, $location, $route) {
        var vm = this;
        // vm.test = "hello world";
        vm.currentUser = UserService.currentUser;
        vm.userMenu = [
            {
                title: "Home",
                url: "#/home",
                current: true
            },
            {
                title: "Favorites",
                url: "#/favorite",
                current: false
            },
            {
                title: "Trending",
                url: "#/trending",
                current: false
            },
            {
                title: "Artists",
                url: "#/artist",
                current: false
            },
            {
                title: "Albums",
                url: "#/album",
                current: false
            },
            {
                title: "Logout",
                url: "#/logout",
                current: false
            },];
        vm.guestMenu = [
            {
                title: "Home",
                url: "#/home",
                current: true
            },
            {
                title: "Trending",
                url: "#/trending",
                current: false
            },
            {
                title: "Artists",
                url: "#/artist",
                current: false
            },
            {
                title: "Albums",
                url: "#/album",
                current: false
            },
            {
                title: "Login",
                url: "#/login",
                current: false
            },];

        // m in {true: model.userMenu, false:model.guestMenu}[model.currentUser._id]

        console.log(vm.currentUser);
        vm.menu = vm.currentUser._id?vm.userMenu:vm.guestMenu;

        function init() {

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
