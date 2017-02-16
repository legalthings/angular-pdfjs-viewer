/**
 * angular-pdfjs
 * https://github.com/legalthings/angular-pdfjs
 * Copyright (c) 2015 ; Licensed MIT
 */

+function () {
    'use strict';

    var module = angular.module('pdfjsViewer', []);
    
    module.provider('pdfjsViewerConfig', function() {
        var config = {
            workerSrc: null,
            cmapDir: null,
            imageResourcesPath: null,
            disableWorker: false,
            verbosity: null,
            buttons: {
                sidebarToggle : true,
                viewFind : true,
                previous : true,
                next : true,
                pageNumberLabel : true,
                pageNumber : true,
                numPages : true,
                zoomOut : true,
                zoomIn : true,
                scaleSelectContainer : true,
                presentationMode : true,
                openFile : true,
                print : true,
                download : true,
                viewBookmark : true,
                secondaryToolbarToggle : true
            }
        };
        
        this.setWorkerSrc = function(src) {
            config.workerSrc = src;
        };
        
        this.setCmapDir = function(dir) {
            config.cmapDir = dir;
        };
        
        this.setImageDir = function(dir) {
            config.imageDir = dir;
        };
        
        this.disableWorker = function(value) {
            if (typeof value === 'undefined') value = true;
            config.disableWorker = value;
        }
        
        this.setVerbosity = function(level) {
            config.verbosity = level;
        };

        this.setButtonsVisibility = function(buttons) {
            for (var key in buttons) {
                if (config.buttons.hasOwnProperty(key)) {
                    if (buttons[key] === false) {
                        config.buttons[key] = false;
                    }
                    else {
                        config.buttons[key] = true;
                    }
                }
            }
        };
        
        this.$get = function() {
            return config;
        }
    });
    
    module.run(['pdfjsViewerConfig', function(pdfjsViewerConfig) {
        if (pdfjsViewerConfig.workerSrc) {
            PDFJS.workerSrc = pdfjsViewerConfig.workerSrc;
        }

        if (pdfjsViewerConfig.cmapDir) {
            PDFJS.cMapUrl = pdfjsViewerConfig.cmapDir;
        }

        if (pdfjsViewerConfig.imageDir) {
            PDFJS.imageResourcesPath = pdfjsViewerConfig.imageDir;
        }
        
        if (pdfjsViewerConfig.disableWorker) {
            PDFJS.disableWorker = true;
        }

        if (pdfjsViewerConfig.verbosity !== null) {
            var level = pdfjsViewerConfig.verbosity;
            if (typeof level === 'string') level = PDFJS.VERBOSITY_LEVELS[level];
            PDFJS.verbosity = level;    
        }
    }]);
    
    module.directive('pdfjsViewer', ['$interval', 'pdfjsViewerConfig', function ($interval, pdfjsViewerConfig) {
        return {
            templateUrl: file.folder + '../../pdf.js-viewer/viewer.html',
            restrict: 'E',
            scope: {
                onInit: '&',
                onPageLoad: '&',
                scale: '=?',
                buttons: '=?'
            },
            link: function ($scope, $element, $attrs) {
                $element.children().wrap('<div class="pdfjs" style="width: 100%; height: 100%;"></div>');
                
                var initialised = false;
                var loaded = {};
                var numLoaded = 0;

                function onPdfInit() {
                    initialised = true;
                    
                    if ($attrs.removeMouseListeners === "true") {
                        window.removeEventListener('DOMMouseScroll', handleMouseWheel);
                        window.removeEventListener('mousewheel', handleMouseWheel);
                        
                        var pages = document.querySelectorAll('.page');
                        angular.forEach(pages, function (page) {
                            angular.element(page).children().css('pointer-events', 'none');
                        });
                    }
                    if ($scope.onInit) $scope.onInit();
                }
                
                var poller = $interval(function () {
                    var pdfViewer = PDFViewerApplication.pdfViewer;
                    
                    if (pdfViewer) {
                        if ($scope.scale !== pdfViewer.currentScale) {
                            loaded = {};
                            numLoaded = 0;
                            $scope.scale = pdfViewer.currentScale;
                        }
                    } else {
                        console.warn("PDFViewerApplication.pdfViewer is not set");
                    }
                    
                    var pages = document.querySelectorAll('.page');
                    angular.forEach(pages, function (page) {
                        var element = angular.element(page);
                        var pageNum = element.attr('data-page-number');
                        
                        if (!element.attr('data-loaded')) {
                            delete loaded[pageNum];
                            return;
                        }
                        
                        if (pageNum in loaded) return;

                        if (!initialised) onPdfInit();
                        
                        if ($scope.onPageLoad) {
                            if ($scope.onPageLoad({page: pageNum}) === false) return;
                        }
                        
                        loaded[pageNum] = true;
                        numLoaded++;
                    });
                }, 200);

                $element.on('$destroy', function() {
                    $interval.cancel(poller);
                });

                $scope.$watch(function () {
                    return $attrs.src;
                }, function () {
                    if (!$attrs.src) return;

                    // Restored for backward compatibility
                    if ($attrs.open){
                        $scope.buttons.openFile = ($attrs.open === 'true');
                    }
		
                    // Restored for backward compatibility
                    if ($attrs.download) {		
                        $scope.buttons.download = ($attrs.download === 'true');
                    }

                    // Restored for backward compatibility
                    if ($attrs.print) {		
                        $scope.buttons.print = ($attrs.print === 'true');
                    }

                    setButtonsVisibility(pdfjsViewerConfig.buttons, $scope.buttons);

                    if ($attrs.width) {
                        document.getElementById('outerContainer').style.width = $attrs.width;
                    }

                    if ($attrs.height) {
                        document.getElementById('outerContainer').style.height = $attrs.height;
                    }
                    
                    PDFJS.webViewerLoad($attrs.src);
                });
            }
        };
    }]);

    function setButtonsVisibility(defaultButtons, buttons) {
        for (var key in defaultButtons) {
            var keyValue = null;
            if (buttons && buttons.hasOwnProperty(key)) {
                keyValue = buttons[key];
            }
            else {
                keyValue = defaultButtons[key];
            }

            var button = document.getElementById(key);
            if (button !== null) {
                if (keyValue === false) {
                    button.setAttribute('hidden', 'true');
                }
                else {
                    button.removeAttribute('hidden');
                }
            }
            var buttonSecond = document.getElementById('secondary' + (key.charAt(0).toUpperCase() + key.slice(1)));
            if (buttonSecond !== null) {
                if (keyValue === false) {
                    buttonSecond.setAttribute('hidden', 'true');
                }
                else {
                    button.removeAttribute('hidden');
                }
            }
        }
    }

    // === get current script file ===
    var file = {};
    file.scripts = document.querySelectorAll('script[src]');
    file.path = file.scripts[file.scripts.length - 1].src;
    file.filename = getFileName(file.path);
    file.folder = getLocation(file.path).pathname.replace(file.filename, '');

    function getFileName(url) {
        var anchor = url.indexOf('#');
        var query = url.indexOf('?');
        var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);

        return url.substring(url.lastIndexOf('/', end) + 1, end);
    }

    function getLocation(href) {
        var location = document.createElement("a");
        location.href = href;

        if (!location.host) location.href = location.href; // Weird assigment

        return location;
    }
    // ======
}();
