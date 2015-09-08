/**
 * angular-pdfjs
 * https://github.com/legalthings/angular-pdfjs
 * Copyright (c) 2015 ; Licensed MIT
 */

'use strict';

// inlined script from: https://raw.githubusercontent.com/urish/angular-load/master/angular-load.min.js
!function(){"use strict";angular.module("angularLoad",[]).service("angularLoad",["$document","$q","$timeout",function(a,b,c){function d(a){var d={};return function(e){if("undefined"==typeof d[e]){var f=b.defer(),g=a(e);g.onload=g.onreadystatechange=function(a){c(function(){f.resolve(a)})},g.onerror=function(a){c(function(){f.reject(a)})},d[e]=f.promise}return d[e]}}var e=a[0];this.loadScript=d(function(a){var b=e.createElement("script");return b.src=a,e.body.appendChild(b),b}),this.loadCSS=d(function(a){var b=e.createElement("link");return b.rel="stylesheet",b.type="text/css",b.href=a,e.head.appendChild(b),b})}])}();

angular.module('pdfjs', ['angularLoad']);

angular.module('pdfjs').directive('pdfjsViewer', ['angularLoad', function (angularLoad) {
    function dependenciesLoaded (callback) {
        angularLoad.loadScript(file.folder + '../../pdf.js-viewer/pdf.js').then(function () {
            angularLoad.loadScript(file.folder + '../../pdf.js-viewer/pdf.worker.js').then(function () {
                angularLoad.loadCSS(file.folder + '../../pdf.js-viewer/viewer.css').then(function () {
                    callback();
                });
            });
        });
    }

    return {
        templateUrl: file.folder + '../../pdf.js-viewer/viewer.html',
        restrict: 'E',
        link: function ($scope, $element, $attrs) {
            dependenciesLoaded(function () {
                $element.children().wrap('<div class="pdfjs" style="width: 100%; height: 100%;"></div>');

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
