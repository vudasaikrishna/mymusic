(function(){
    angular
        .module("MyMusic")
        .controller("MessageController", MessageController);

    function MessageController(UserService, currentUser, $location) {
        var vm = this;
        vm.track = {};

        function init() {
            vm.currentUser = currentUser;
            console.log(vm.currentUser);
            UserService.updateCurrentUser(currentUser);

            UserService
                .getMessages()
                .then(function (messages) {
                    console.log(messages);
                    vm.messages = messages;
                }, function (err) {
                    vm.error = "Error loading messages";
                })
        }
        init();

        //event handlers
        vm.viewMessage = viewMessage;

        function viewMessage(message) {
            console.log(message);

            UserService
                .removeMessage(currentUser._id, message)
                .then(function (success) {
                    $location.url('/track/'+message.track.mbid);
                }, function (err) {
                    vm.error = "Error opening track. Please try after sometime."
                })
        }
    }

})();
