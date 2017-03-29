module.exports = function (app, model) {
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    //var userModel = require('./../model/user/user.model.server')();

    var userModel = model.userModel;

    function createUser(req, res) {
        //console.log(req.body);
        userModel
            .createUser(req.body)
            .then(function (user) {
                //console.log(user);
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteUser(req, res) {
        userModel
            .deleteUser(req.params.userId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*var userId = req.params.userId;
        for (var u in users){
            if (users[u]._id == userId){
                users.splice(u,1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        //console.log(newUser);
        userModel
            .updateUser(userId,newUser)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        for(var u in users) {
            if( users[u]._id == userId ) {
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                res.json(users[u]);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        var user = users.find(function (u) {
            return u._id == userId;
        });
        res.json(user);*/
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            findUserByCredentials(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        userModel
            .findUserByUsername(req.query.username)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        var user = users.find(function (u) {
            return u.username == req.query.username;
        });
        console.log(user);
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }*/
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
/*        //console.log("find user by credentials HTTP service");
        var user = users.find(function(user){
            return user.password == password && user.username == username;
        });
        //console.log(user);
        res.json(user);*/
    }
}