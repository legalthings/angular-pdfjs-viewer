/**
 * angular-pdfjs
 * https://github.com/legalthings/angular-pdfjs
 * Copyright (c) 2015 ; Licensed MIT
 */

'use strict';

angular.module('pdfjs', []);

angular.module('pdfjs').directive('pdfjsViewer', [function () {
    return {
        templateUrl: file.folder + '../../pdf.js-viewer/viewer.html',
        restrict: 'E',
        link: function ($scope, $element, $attrs) {
            $element.children().wrap('<div class="pdfjs" style="width: 100%; height: 100%;"></div>');

            $scope.$watch(function () {
                return $attrs.src;
            }, function () {
                if (!$attrs.src) return;

                if ($attrs.localeDir) {
                    // not sure how to set locale dir in PDFJS
                }

                if ($attrs.cmapDir) {
                    PDFJS.cMapUrl = $attrs.cmapDir;
                }

                if ($attrs.imageDir) {
                    PDFJS.imageResourcesPath = $attrs.imageDir;
                }

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

                PDFJS.webViewerLoad($attrs.src);
            });
        }
    };
}]);

var file = {};
file.scripts = document.querySelectorAll('script[src]');
file.path = file.scripts[file.scripts.length-1].src;
file.filename = getFileName(file.path);
file.folder = getLocation(file.path).pathname.replace(file.filename, '');

function getFileName(url) {
  var anchor = url.indexOf('#');
  var query = url.indexOf('?');
  var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);

  return url.substring(url.lastIndexOf('/', end) + 1, end);
}

function getLocation (href) {
    var location = document.createElement("a");
    location.href = href;

    if (location.host == '') location.href = location.href;

    return location;
};
