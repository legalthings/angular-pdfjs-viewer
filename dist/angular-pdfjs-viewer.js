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
            verbosity: null
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
        };
        
        this.setVerbosity = function(level) {
            config.verbosity = level;
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
            PDFJS.verbosity = pdfjsViewerConfig.verbosity;
        }
    }]);
    
    module.directive('pdfjsViewer', ['$interval', function ($interval) {
        return {
            template: '<pdfjs-wrapper>\n' +
'    <div id="outerContainer">\n' +
'\n' +
'      <div id="sidebarContainer">\n' +
'        <div id="toolbarSidebar">\n' +
'          <div class="splitToolbarButton toggled">\n' +
'            <button id="viewThumbnail" class="toolbarButton group toggled" title="Show Thumbnails" tabindex="2" data-l10n-id="thumbs">\n' +
'               <span data-l10n-id="thumbs_label">Thumbnails</span>\n' +
'            </button>\n' +
'            <button id="viewOutline" class="toolbarButton group" title="Show Document Outline (double-click to expand/collapse all items)" tabindex="3" data-l10n-id="document_outline">\n' +
'               <span data-l10n-id="document_outline_label">Document Outline</span>\n' +
'            </button>\n' +
'            <button id="viewAttachments" class="toolbarButton group" title="Show Attachments" tabindex="4" data-l10n-id="attachments">\n' +
'               <span data-l10n-id="attachments_label">Attachments</span>\n' +
'            </button>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div id="sidebarContent">\n' +
'          <div id="thumbnailView">\n' +
'          </div>\n' +
'          <div id="outlineView" class="hidden">\n' +
'          </div>\n' +
'          <div id="attachmentsView" class="hidden">\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>  <!-- sidebarContainer -->\n' +
'\n' +
'      <div id="mainContainer">\n' +
'        <div class="findbar hidden doorHanger hiddenSmallView" id="findbar">\n' +
'          <label for="findInput" class="toolbarLabel" data-l10n-id="find_label">Find:</label>\n' +
'          <input id="findInput" class="toolbarField" tabindex="91">\n' +
'          <div class="splitToolbarButton">\n' +
'            <button class="toolbarButton findPrevious" title="" id="findPrevious" tabindex="92" data-l10n-id="find_previous">\n' +
'              <span data-l10n-id="find_previous_label">Previous</span>\n' +
'            </button>\n' +
'            <div class="splitToolbarButtonSeparator"></div>\n' +
'            <button class="toolbarButton findNext" title="" id="findNext" tabindex="93" data-l10n-id="find_next">\n' +
'              <span data-l10n-id="find_next_label">Next</span>\n' +
'            </button>\n' +
'          </div>\n' +
'          <input type="checkbox" id="findHighlightAll" class="toolbarField" tabindex="94">\n' +
'          <label for="findHighlightAll" class="toolbarLabel" data-l10n-id="find_highlight">Highlight all</label>\n' +
'          <input type="checkbox" id="findMatchCase" class="toolbarField" tabindex="95">\n' +
'          <label for="findMatchCase" class="toolbarLabel" data-l10n-id="find_match_case_label">Match case</label>\n' +
'          <span id="findResultsCount" class="toolbarLabel hidden"></span>\n' +
'          <span id="findMsg" class="toolbarLabel"></span>\n' +
'        </div>  <!-- findbar -->\n' +
'\n' +
'        <div id="secondaryToolbar" class="secondaryToolbar hidden doorHangerRight">\n' +
'          <div id="secondaryToolbarButtonContainer">\n' +
'            <button id="secondaryPresentationMode" class="secondaryToolbarButton presentationMode visibleLargeView" title="Switch to Presentation Mode" tabindex="51" data-l10n-id="presentation_mode">\n' +
'              <span data-l10n-id="presentation_mode_label">Presentation Mode</span>\n' +
'            </button>\n' +
'\n' +
'            <button id="secondaryOpenFile" class="secondaryToolbarButton openFile visibleLargeView" title="Open File" tabindex="52" data-l10n-id="open_file">\n' +
'              <span data-l10n-id="open_file_label">Open</span>\n' +
'            </button>\n' +
'\n' +
'            <button id="secondaryPrint" class="secondaryToolbarButton print visibleMediumView" title="Print" tabindex="53" data-l10n-id="print">\n' +
'              <span data-l10n-id="print_label">Print</span>\n' +
'            </button>\n' +
'\n' +
'            <button id="secondaryDownload" class="secondaryToolbarButton download visibleMediumView" title="Download" tabindex="54" data-l10n-id="download">\n' +
'              <span data-l10n-id="download_label">Download</span>\n' +
'            </button>\n' +
'\n' +
'            <a href="#" id="secondaryViewBookmark" class="secondaryToolbarButton bookmark visibleSmallView" title="Current view (copy or open in new window)" tabindex="55" data-l10n-id="bookmark">\n' +
'              <span data-l10n-id="bookmark_label">Current View</span>\n' +
'            </a>\n' +
'\n' +
'            <div class="horizontalToolbarSeparator visibleLargeView"></div>\n' +
'\n' +
'            <button id="firstPage" class="secondaryToolbarButton firstPage" title="Go to First Page" tabindex="56" data-l10n-id="first_page">\n' +
'              <span data-l10n-id="first_page_label">Go to First Page</span>\n' +
'            </button>\n' +
'            <button id="lastPage" class="secondaryToolbarButton lastPage" title="Go to Last Page" tabindex="57" data-l10n-id="last_page">\n' +
'              <span data-l10n-id="last_page_label">Go to Last Page</span>\n' +
'            </button>\n' +
'\n' +
'            <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'            <button id="pageRotateCw" class="secondaryToolbarButton rotateCw" title="Rotate Clockwise" tabindex="58" data-l10n-id="page_rotate_cw">\n' +
'              <span data-l10n-id="page_rotate_cw_label">Rotate Clockwise</span>\n' +
'            </button>\n' +
'            <button id="pageRotateCcw" class="secondaryToolbarButton rotateCcw" title="Rotate Counterclockwise" tabindex="59" data-l10n-id="page_rotate_ccw">\n' +
'              <span data-l10n-id="page_rotate_ccw_label">Rotate Counterclockwise</span>\n' +
'            </button>\n' +
'\n' +
'            <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'            <button id="toggleHandTool" class="secondaryToolbarButton handTool" title="Enable hand tool" tabindex="60" data-l10n-id="hand_tool_enable">\n' +
'              <span data-l10n-id="hand_tool_enable_label">Enable hand tool</span>\n' +
'            </button>\n' +
'\n' +
'            <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'            <button id="documentProperties" class="secondaryToolbarButton documentProperties" title="Document Properties…" tabindex="61" data-l10n-id="document_properties">\n' +
'              <span data-l10n-id="document_properties_label">Document Properties…</span>\n' +
'            </button>\n' +
'          </div>\n' +
'        </div>  <!-- secondaryToolbar -->\n' +
'\n' +
'        <div class="toolbar">\n' +
'          <div id="toolbarContainer">\n' +
'            <div id="toolbarViewer">\n' +
'              <div id="toolbarViewerLeft">\n' +
'                <button id="sidebarToggle" class="toolbarButton" title="Toggle Sidebar" tabindex="11" data-l10n-id="toggle_sidebar">\n' +
'                  <span data-l10n-id="toggle_sidebar_label">Toggle Sidebar</span>\n' +
'                </button>\n' +
'                <div class="toolbarButtonSpacer"></div>\n' +
'                <button id="viewFind" class="toolbarButton group hiddenSmallView" title="Find in Document" tabindex="12" data-l10n-id="findbar">\n' +
'                   <span data-l10n-id="findbar_label">Find</span>\n' +
'                </button>\n' +
'                <div class="splitToolbarButton">\n' +
'                  <button class="toolbarButton pageUp" title="Previous Page" id="previous" tabindex="13" data-l10n-id="previous">\n' +
'                    <span data-l10n-id="previous_label">Previous</span>\n' +
'                  </button>\n' +
'                  <div class="splitToolbarButtonSeparator"></div>\n' +
'                  <button class="toolbarButton pageDown" title="Next Page" id="next" tabindex="14" data-l10n-id="next">\n' +
'                    <span data-l10n-id="next_label">Next</span>\n' +
'                  </button>\n' +
'                </div>\n' +
'                <input type="number" id="pageNumber" class="toolbarField pageNumber" title="Page" value="1" size="4" min="1" tabindex="15" data-l10n-id="page">\n' +
'                <span id="numPages" class="toolbarLabel"></span>\n' +
'              </div>\n' +
'              <div id="toolbarViewerRight">\n' +
'                <button id="presentationMode" class="toolbarButton presentationMode hiddenLargeView" title="Switch to Presentation Mode" tabindex="31" data-l10n-id="presentation_mode">\n' +
'                  <span data-l10n-id="presentation_mode_label">Presentation Mode</span>\n' +
'                </button>\n' +
'\n' +
'                <button id="openFile" class="toolbarButton openFile hiddenLargeView" title="Open File" tabindex="32" data-l10n-id="open_file">\n' +
'                  <span data-l10n-id="open_file_label">Open</span>\n' +
'                </button>\n' +
'\n' +
'                <button id="print" class="toolbarButton print hiddenMediumView" title="Print" tabindex="33" data-l10n-id="print">\n' +
'                  <span data-l10n-id="print_label">Print</span>\n' +
'                </button>\n' +
'\n' +
'                <button id="download" class="toolbarButton download hiddenMediumView" title="Download" tabindex="34" data-l10n-id="download">\n' +
'                  <span data-l10n-id="download_label">Download</span>\n' +
'                </button>\n' +
'                <a href="#" id="viewBookmark" class="toolbarButton bookmark hiddenSmallView" title="Current view (copy or open in new window)" tabindex="35" data-l10n-id="bookmark">\n' +
'                  <span data-l10n-id="bookmark_label">Current View</span>\n' +
'                </a>\n' +
'\n' +
'                <div class="verticalToolbarSeparator hiddenSmallView"></div>\n' +
'\n' +
'                <button id="secondaryToolbarToggle" class="toolbarButton" title="Tools" tabindex="36" data-l10n-id="tools">\n' +
'                  <span data-l10n-id="tools_label">Tools</span>\n' +
'                </button>\n' +
'              </div>\n' +
'              <div id="toolbarViewerMiddle">\n' +
'                <div class="splitToolbarButton">\n' +
'                  <button id="zoomOut" class="toolbarButton zoomOut" title="Zoom Out" tabindex="21" data-l10n-id="zoom_out">\n' +
'                    <span data-l10n-id="zoom_out_label">Zoom Out</span>\n' +
'                  </button>\n' +
'                  <div class="splitToolbarButtonSeparator"></div>\n' +
'                  <button id="zoomIn" class="toolbarButton zoomIn" title="Zoom In" tabindex="22" data-l10n-id="zoom_in">\n' +
'                    <span data-l10n-id="zoom_in_label">Zoom In</span>\n' +
'                   </button>\n' +
'                </div>\n' +
'                <span id="scaleSelectContainer" class="dropdownToolbarButton">\n' +
'                  <select id="scaleSelect" title="Zoom" tabindex="23" data-l10n-id="zoom">\n' +
'                    <option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="page_scale_auto">Automatic Zoom</option>\n' +
'                    <option id="pageActualOption" title="" value="page-actual" data-l10n-id="page_scale_actual">Actual Size</option>\n' +
'                    <option id="pageFitOption" title="" value="page-fit" data-l10n-id="page_scale_fit">Fit Page</option>\n' +
'                    <option id="pageWidthOption" title="" value="page-width" data-l10n-id="page_scale_width">Full Width</option>\n' +
'                    <option id="customScaleOption" title="" value="custom" disabled="disabled" hidden="true"></option>\n' +
'                    <option title="" value="0.5" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 50 }\'>50%</option>\n' +
'                    <option title="" value="0.75" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 75 }\'>75%</option>\n' +
'                    <option title="" value="1" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 100 }\'>100%</option>\n' +
'                    <option title="" value="1.25" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 125 }\'>125%</option>\n' +
'                    <option title="" value="1.5" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 150 }\'>150%</option>\n' +
'                    <option title="" value="2" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 200 }\'>200%</option>\n' +
'                    <option title="" value="3" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 300 }\'>300%</option>\n' +
'                    <option title="" value="4" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 400 }\'>400%</option>\n' +
'                  </select>\n' +
'                </span>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div id="loadingBar">\n' +
'              <div class="progress">\n' +
'                <div class="glimmer">\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'\n' +
'        <menu type="context" id="viewerContextMenu">\n' +
'          <menuitem id="contextFirstPage" label="First Page"\n' +
'                    data-l10n-id="first_page"></menuitem>\n' +
'          <menuitem id="contextLastPage" label="Last Page"\n' +
'                    data-l10n-id="last_page"></menuitem>\n' +
'          <menuitem id="contextPageRotateCw" label="Rotate Clockwise"\n' +
'                    data-l10n-id="page_rotate_cw"></menuitem>\n' +
'          <menuitem id="contextPageRotateCcw" label="Rotate Counter-Clockwise"\n' +
'                    data-l10n-id="page_rotate_ccw"></menuitem>\n' +
'        </menu>\n' +
'\n' +
'        <div id="viewerContainer" tabindex="0">\n' +
'          <div id="viewer" class="pdfViewer"></div>\n' +
'        </div>\n' +
'\n' +
'        <div id="errorWrapper" hidden=\'true\'>\n' +
'          <div id="errorMessageLeft">\n' +
'            <span id="errorMessage"></span>\n' +
'            <button id="errorShowMore" data-l10n-id="error_more_info">\n' +
'              More Information\n' +
'            </button>\n' +
'            <button id="errorShowLess" data-l10n-id="error_less_info" hidden=\'true\'>\n' +
'              Less Information\n' +
'            </button>\n' +
'          </div>\n' +
'          <div id="errorMessageRight">\n' +
'            <button id="errorClose" data-l10n-id="error_close">\n' +
'              Close\n' +
'            </button>\n' +
'          </div>\n' +
'          <div class="clearBoth"></div>\n' +
'          <textarea id="errorMoreInfo" hidden=\'true\' readonly="readonly"></textarea>\n' +
'        </div>\n' +
'      </div> <!-- mainContainer -->\n' +
'\n' +
'      <div id="overlayContainer" class="hidden">\n' +
'        <div id="passwordOverlay" class="container hidden">\n' +
'          <div class="dialog">\n' +
'            <div class="row">\n' +
'              <p id="passwordText" data-l10n-id="password_label">Enter the password to open this PDF file:</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <!-- The type="password" attribute is set via script, to prevent warnings in Firefox for all http:// documents. -->\n' +
'              <input id="password" class="toolbarField">\n' +
'            </div>\n' +
'            <div class="buttonRow">\n' +
'              <button id="passwordCancel" class="overlayButton"><span data-l10n-id="password_cancel">Cancel</span></button>\n' +
'              <button id="passwordSubmit" class="overlayButton"><span data-l10n-id="password_ok">OK</span></button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div id="documentPropertiesOverlay" class="container hidden">\n' +
'          <div class="dialog">\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_file_name">File name:</span> <p id="fileNameField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_file_size">File size:</span> <p id="fileSizeField">-</p>\n' +
'            </div>\n' +
'            <div class="separator"></div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_title">Title:</span> <p id="titleField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_author">Author:</span> <p id="authorField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_subject">Subject:</span> <p id="subjectField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_keywords">Keywords:</span> <p id="keywordsField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_creation_date">Creation Date:</span> <p id="creationDateField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_modification_date">Modification Date:</span> <p id="modificationDateField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_creator">Creator:</span> <p id="creatorField">-</p>\n' +
'            </div>\n' +
'            <div class="separator"></div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_producer">PDF Producer:</span> <p id="producerField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_version">PDF Version:</span> <p id="versionField">-</p>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="document_properties_page_count">Page Count:</span> <p id="pageCountField">-</p>\n' +
'            </div>\n' +
'            <div class="buttonRow">\n' +
'              <button id="documentPropertiesClose" class="overlayButton"><span data-l10n-id="document_properties_close">Close</span></button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div id="printServiceOverlay" class="container hidden">\n' +
'          <div class="dialog">\n' +
'            <div class="row">\n' +
'              <span data-l10n-id="print_progress_message">Preparing document for printing…</span>\n' +
'            </div>\n' +
'            <div class="row">\n' +
'              <progress value="0" max="100"></progress>\n' +
'              <span data-l10n-id="print_progress_percent" data-l10n-args=\'{ "progress": 0 }\' class="relative-progress">0%</span>\n' +
'            </div>\n' +
'            <div class="buttonRow">\n' +
'              <button id="printCancel" class="overlayButton"><span data-l10n-id="print_progress_close">Cancel</span></button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>  <!-- overlayContainer -->\n' +
'\n' +
'    </div> <!-- outerContainer -->\n' +
'    <div id="printContainer"></div>\n' +
'  </pdfjs-wrapper>',
            restrict: 'E',
            scope: {
                onInit: '&',
                onPageLoad: '&',
                scale: '=?',
                src: '@?',
                data: '=?'
            },
            link: function ($scope, $element, $attrs) {
                $element.children().wrap('<div class="pdfjs" style="width: 100%; height: 100%;"></div>');
                
                var initialised = false;
                var loaded = {};
                var numLoaded = 0;

                if (!window.PDFJS) {
                    return console.warn("PDFJS is not set! Make sure that pdf.js is loaded before angular-pdfjs-viewer.js is loaded.");
                }

                // initialize the pdf viewer with (with empty source)
                window.PDFJS.webViewerLoad("");

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
                    if (!window.PDFViewerApplication) {
                        return;
                    }

                    var pdfViewer = window.PDFViewerApplication.pdfViewer;
                    
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

                // watch pdf source
                $scope.$watchGroup([
                    function () { return $scope.src; },
                    function () { return $scope.data; }
                ], function (values) {
                    var src = values[0];
                    var data = values[1];

                    if (!src && !data) {
                        return;
                    }

                    window.PDFViewerApplication.open(src || data);
                });

                // watch other attributes
                $scope.$watch(function () {
                    return $attrs;
                }, function () {
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

                    if ($attrs.width) {
                        document.getElementById('outerContainer').style.width = $attrs.width;
                    }

                    if ($attrs.height) {
                        document.getElementById('outerContainer').style.height = $attrs.height;
                    }
                });
            }
        };
    }]);
}();
