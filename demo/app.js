angular.module('app', ['pdfjsViewer']);

angular.module('app').config(function(pdfjsViewerConfigProvider) {
    pdfjsViewerConfigProvider.setButtonsVisibility({
        openFile : true,
        print : true,
        download : false,
        viewBookmark : true
    });
});

angular.module('app').controller('AppCtrl', function($scope) {
    $scope.pdf = {
        src: 'example.pdf'
    };

    $scope.buttons = {
        print : false,
        download: true
    }
});
