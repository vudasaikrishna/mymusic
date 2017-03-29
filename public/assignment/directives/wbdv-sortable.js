(function () {
    angular
        .module('wbdvDirectives', [])
        .directive('sortable', sortableDir);

    function sortableDir() {
        //console.log("Sortable Dir");
        function linkFunc(scope, element) {
            var startIndex = -1;
            var stopIndex = -1;
            element
                .sortable({
                    axis: 'y',
                    handle: ".glyphicon-align-justify",
                    start: function (event, ui) {
                        startIndex = ui.item.index();
                    },
                    stop: function (event, ui) {
                        stopIndex = ui.item.index();
                        //console.log([startIndex, stopIndex]);
                        scope.sortableController.sort(startIndex, stopIndex);
                    }
                })
                .disableSelection();
        }
        return {
            scope:{},
            link: linkFunc,
            controller: sortableController,
            controllerAs: 'sortableController'
        };
    }

    function sortableController(WidgetService) {
        var vm = this;
        vm.sort = sort;

        function sort(start, end) {
            console.log([start,end]);
            WidgetService.sortWidgets(start,end).then(function(status){
                console.log(status);
            });
        }
    }
})();
