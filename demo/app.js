angular.module('app', ['pdfjsViewer']);

angular.module('app').controller('AppCtrl', function($scope) {
    $scope.pdf = {
        src: 'example.pdf'
    };
});
