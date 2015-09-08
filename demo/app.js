angular.module('app', ['pdfjs']);

angular.module('app').controller('AppCtrl', function($scope) {
    $scope.pdf = {
        src: 'example.pdf'
    };
});
