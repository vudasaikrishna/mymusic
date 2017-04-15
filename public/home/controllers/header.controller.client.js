(function(){
    angular
        .module("MyMusic")
        .controller("HeaderController", HeaderController);

    function HeaderController(UserService, MusicService, $location) {
        var vm = this;
        // vm.test = "hello world";
        vm.currentUser = UserService.currentUser;
        console.log(vm.currentUser);

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

        function searchTracks() {
            //console.log(vm.searchTerm);
            MusicService.searchKey = vm.searchTerm;

            $location.url('/track');
            // this.$apply();
        }



    }
})();
