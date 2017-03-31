angular.module('app', ['pdfjsViewer']);

angular.module('app').controller('AppCtrl', function ($scope, $http, $timeout) {
    var url = 'example.pdf';

    $scope.pdf = {
        srcAsString: url,
        srcAsBinary: null
    };

    getPdfAsBinary(url).then(function (response) {
        $scope.pdf.srcAsBinary = new Uint8Array(response.data);
    }, function (err) {
        console.log('failed to get pdf as binary:', err);
    });

    function getPdfAsBinary (url) {
        return $http.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'foo': 'bar'
            }
        });
    }
});
