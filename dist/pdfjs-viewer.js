/**
 * angular-pdfjs
 * https://github.com/legalthings/angular-pdfjs
 * Copyright (c) 2015 ; Licensed MIT
 */
angular.module('pdfjs', []);

angular.module('pdfjs').directive('pdfjsViewer', [function () {
    return {
        templateUrl: 'template.html',
        restrict: 'E',
        link: function ($scope, $element, $attrs) {
            $scope.$watch(function () {
                return $attrs.src;
            }, function () {
                if (!$attrs.src) return;

                if ($attrs.open === 'false') {
                    document.getElementById('openFile').setAttribute('hidden', 'true');
                    document.getElementById('secondaryOpenFile').setAttribute('hidden', 'true');
                }

                if ($attrs.download === 'false') {
                    document.getElementById('download').setAttribute('hidden', 'true');
                    document.getElementById('secondaryDownload').setAttribute('hidden', 'true');
                }

                if ($attrs.print === 'false') {
                    document.getElementById('print').setAttribute('hidden', 'true');
                    document.getElementById('secondaryPrint').setAttribute('hidden', 'true');
                }

                if ($attrs.width) document.getElementById('outerContainer').style.width = $attrs.width;
                if ($attrs.height) document.getElementById('outerContainer').style.height = $attrs.height;

                if (!PDFViewerApplication.initialized) return PDFJS.webViewerLoad($attrs.src);

                PDFViewerApplication.open($attrs.src, 0);
            });
        }
    };
}]);
