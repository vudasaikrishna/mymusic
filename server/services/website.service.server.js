module.exports = function (app, model) {
    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findWebsitesByUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    //var websiteModel = require('./../model/website/website.model.server')();
    var websiteModel = model.websiteModel;
    var userModel = model.userModel;

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .deleteWebsite(websiteId)
            .then(function (status) {
                return userModel.removeWebsite(websiteId);
            })
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var w in websites) {
            if(websiteId == websites[w]._id) {
                websites.splice(w,1);
                res.sendStatus(200)
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        websiteModel
            .updateWebsite(websiteId, website)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var w in websites) {
            if(websiteId == websites[w]._id) {
                websites[w].name = website.name;
                websites[w].update = new Date();
                websites[w].description = website.description;
                res.json(websites[w]);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;

        websiteModel
            .createWebsiteForUser(userId, website)
            .then(function (website) {
                return userModel.addWebsite(userId, website._id);
            })
            .then(function (doc) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*++count;
        website._id = count.toString();
        website.developerId = userId;
        website.update = new Date();
        websites.push(website);
        //console.log(website);
        res.json(website);*/
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        //console.log(websiteId);
        websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                res.json(website);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var w in websites) {
            if(websiteId == websites[w]._id) {
                //console.log(websites[w]);
                res.json(websites[w]);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function findWebsitesByUser(req, res) {
        var userId = req.params.userId;
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                res.json(websites);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*var sites = [];
        for(var w in websites) {
            if(userId === websites[w].developerId) {
                sites.push(websites[w]);
            }
        }
        //console.log(sites);
        res.json(sites);*/
    }
};