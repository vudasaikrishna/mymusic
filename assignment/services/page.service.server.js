module.exports = function (app, model) {
    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findPageByWebsiteId);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    var websiteModel = model.websiteModel;
    var pageModel = model.pageModel;
    var userModel = model.userModel;

    // TODO: Page crud functions

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        pageModel
            .deletePage(pageId)
            .then(function (status) {
                return websiteModel.removePage(pageId);
            })
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
/*        for(var p in pages) {
            if(pageId == pages[p]._id) {
                pages.splice(p,1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;

        pageModel
            .updatePage(pageId, page)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        for(var p in pages) {
            if(pageId == pages[p]._id) {
                pages[p].name = page.name;
                pages[p].description = page.description;
                pages[p].updated = new Date();
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;

        pageModel
            .createPage(websiteId, page)
            .then(function (page) {
                return websiteModel.addPage(websiteId, page._id);
            })
            .then(function (doc) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        count++;
        page._id = count.toString();
        page.websiteId = websiteId;
        pages.push(page);
        res.json(page);*/
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*
        for(var p in pages) {
            if(pageId == pages[p]._id) {
                res.json(pages[p]);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function findPageByWebsiteId(req, res) {
        var websiteId = req.params.websiteId;
        var pagesFetched;
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                pagesFetched = pages;
                //return userModel.findUserById(pages)
                res.json(pages);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*var pgs = [];
        for(var p in pages) {
            if(websiteId == pages[p].websiteId) {
                pgs.push(pages[p]);
            }
        }
        res.json(pgs);*/
    }
};