(function(){
    angular
        .module("MyMusic")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "home/views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    currUser: checkUser
                }
            })
            .when("/login", {
                templateUrl: "user/views/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/logout", {
                resolve: {
                    logout: logout
                }
            })
            .when('/admin', {
                templateUrl: 'user/views/admin.view.client.html',
                resolve: {
                    adminUser: checkAdmin
                },
                controller: 'AdminController',
                controllerAs: 'model'
            })
            .when("/register", {
                templateUrl: "user/views/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/profile", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/favorite", {
                templateUrl: "music/views/favorite.view.client.html",
                controller: "FavoriteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/trending", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/artist", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/album", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/track", {
                templateUrl: "music/views/track-list.view.client.html",
                controller: "TrackListController",
                controllerAs: "model",
                /*resolve: {
                 currentUser: checkUser
                 }*/
            })
            .when("/track/:tid", {
                templateUrl: "music/views/track.view.client.html",
                controller: "TrackController",
                controllerAs: "model",
                /*resolve: {
                 currentUser: checkUser
                 }*/
            })
            .otherwise({
                redirectTo: "/home"
            })
        // $locationProvider.html5Mode(true);
    }

    function logout($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .logout()
            .then(function () {
                UserService.currentUser.username = null;
                UserService.currentUser._id = null;
                UserService.currentUser.photo = null;
                UserService.currentUser.firstName = null;
                defer.reject();
                $location.url('/login');
            });
        return defer.promise;
    }

    function checkLoggedIn($q, UserService, $location) {
        console.log("Checking login...");
        var defer = $q.defer();
        UserService
            .loggedin()
            .then(function (user) {
                if(user != '0') {
                    console.log("LoggedIn");
                    //console.log(user);
                    // $rootScope.currentUser = user;
                    UserService.currentUser.username = user.username;
                    UserService.currentUser.firstName = user.firstName;
                    UserService.currentUser._id = user._id;
                    UserService.currentUser.photo = user.photo;
                    console.log(UserService.currentUser);
                    defer.resolve(user);
                } else {
                    UserService.currentUser.username = null;
                    UserService.currentUser.firstName = null;
                    UserService.currentUser._id = null;
                    UserService.currentUser.photo = null;
                    defer.reject();
                    $location.url('/login');
                }
            });
        return defer.promise;
    }

    function checkUser($q, UserService) {
        console.log("Checking User...");
        var defer = $q.defer();
        UserService
            .loggedin()
            .then(function (user) {
                console.log(user);
                defer.resolve(user);
                /*if(user != '0') {
                    //console.log("LoggedIn");
                    console.log(user);
                    defer.resolve(user);
                } else {
                    console.log("rejected")
                    defer.resolve({error: "0"});
                    //$location.url('/login');
                }*/
            });
        return defer.promise;
    }

    function checkAdmin($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .isAdmin()
            .then(function (user) {
                if(user != '0') {
                    defer.resolve(user);
                } else {
                    defer.reject();
                    $location.url('/user/'+user._id);
                }
            });
        return defer.promise;
    }
})();