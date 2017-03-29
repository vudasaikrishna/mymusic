(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController);
    
    function WidgetListController($sce, $location, $routeParams, WidgetService) {
        var vm = this;

        function init() {
            vm.doYouTrustUrl = doYouTrustUrl;
            vm.doYouTrustHTML = doYouTrustHTML;
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.pageId = $routeParams.pid;

            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .success(function (widgets) {
                    vm.widgets = widgets;
                    //console.log(widgets);
                });
        }
        init();

        // event handlers
        // vm.editWidget = editWidget;

        function doYouTrustUrl(url) {
            var baseUrl = "https://www.youtube.com/embed/";
            var urlParts = url.split('/');
            var id = urlParts[urlParts.length - 1];
            baseUrl += id;
            return $sce.trustAsResourceUrl(baseUrl);
        }

        function doYouTrustHTML(text) {
            return $sce.trustAsHtml(text);
        }
    }
})();