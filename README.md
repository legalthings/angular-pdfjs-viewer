# PDF.js viewer Angular directive

Embed [PDF.js](https://mozilla.github.io/pdf.js/) viewer into your angular application, maintaining that look and feel
of pdf's we all love. The directive embeds the [full viewer](https://mozilla.github.io/pdf.js/web/viewer.html), which
allows you to scroll through the pdf.

## Installation

     bower install angular-pdfjs-viewer --save

## Usage

Note that the order of the scripts matters. Stick to the order of dependencies as shown in the example below. Also note
that images, translations and such are being loaded from the `web` folder.

**View**
```html
<!DOCTYPE html>
<html lang="en" data-ng-app="app" ng-controller="AppCtrl">
    <head>
        <meta charset="utf-8"/>
        <title>Angular PDF.js demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script src="vendor/pdf.js-viewer/pdf.worker.js"></script>
        <script src="vendor/pdf.js-viewer/pdf.js"></script>
        <link rel="stylesheet" href="vendor/pdf.js-viewer/viewer.css">

        <script src="vendor/angular/angular.js"></script>
        <script src="vendor/angular-pdfjs/dist/angular-pdfjs.js"></script>
        <script src="app.js"></script>

        <style>
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .some-pdf-container {
            width: 100%;
            height: 100%;
          }
        </style>
    </head>
    <body>
        <div class='some-pdf-container'>
            <pdfjs-viewer src="{{ pdf.src }}" scale="scale"
                          download="true" print="false" open="false"
                          on-init="onInit()" on-page-load="onPageLoad(page)s"
                          cmap-dir="vendor/pdf.js-viewer/cmaps" image-dir="vendor/pdf.js-viewer/images">
            </pdfjs-viewer>
        </div>
    </body>
</html>
```

The `scale` attribute can be used to obtain the current scale (zoom level) of the PDF. This is read only.

The directive takes the following optional attributes to modify the toolbar

    download="false" print="false" open="false"

Omitting these attributes will by default show the options in the toolbar.

The `on-init` function is called when PDF.JS is fully loaded. The `on-page-load` function is each time a page is
loaded and will pass the page number. When the scale changes all pages are unloaded, so `on-page-load` will be called
again for each page.

**Controller**
```js
angular.module('app', ['pdfjs']);

angular.module('app').controller('AppCtrl', function($scope) {
    $scope.pdf = {
        src: 'example.pdf',
    };
    
    $scope.$watch('scale', function() {
      ...
    });
    
    $scope.onInit = function() {
      ...
    };
    
    $scope.onPageLoad = function(page) {
      ...
    };
});
```

## Demo

You can test out a demo of this directive. You must run the node server first due to CORS. First make sure
 the dependencies are installed.

    cd demo
    npm install
    bower install

Afterwards run the server like so.

    node server.js

The server will be running on localhost:8080

