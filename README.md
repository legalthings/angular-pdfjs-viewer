# PDF.js Angular directive

Embed [PDF.js](https://mozilla.github.io/pdf.js/) into your angular application, maintaining that look and feel of pdf's we all love. This directive also allows you to scroll through the pdf.  


## Installation

     bower install git@github.com:legalthings/angular-pdfjs.git#v0.1.0 --save


## Usage

Note that the order of the scripts matters. Stick to the order of dependencies as shown in the example below.
Also note that images, translations and such are being loaded from the `web` folder.

**View**
```html
<!DOCTYPE html>
<html ng-app="app" ng-controller="AppCtrl">
    <head>
        <title>Angular PDF.js demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- pdfjs dependencies -->
        <link rel="stylesheet" href="vendor/angular-pdfjs/dist/web/viewer.css"/>
        <link rel="resource" type="application/l10n" href="vendor/angular-pdfjs/dist/web/locale/locale.properties"/>
        <script src="vendor/angular-pdfjs/dist/web/l10n.js"></script>
        <script src="vendor/angular-pdfjs/dist/build/pdf.js"></script>
        <script src="vendor/angular-pdfjs/dist/build/pdf.worker.js"></script>
        <script src="vendor/angular-pdfjs/dist/web/compatibility.js"></script>
        <script src="vendor/angular-pdfjs/dist/web/debugger.js"></script>
        <script src="vendor/angular-pdfjs/dist/web/viewer.js"></script>

        <!-- angular dependencies -->
        <script src="vendor/angular/angular.js"></script>
        <script src="vendor/angular-pdfjs/dist/pdfjs-viewer.js"></script>
        <script src="app.js"></script>
    </head>
    <body>
        <pdfjs-viewer src="{{ pdf.src }}"></pdfjs-viewer>
    </body>
</html>
```

The directive takes the following optional attributes to modify the toolbar

    download="false" print="false" open="false"

Omitting these attributes will by default show the options in the toolbar.

**Controller**
```js
angular.module('app', ['pdfjs']);

angular.module('app').controller('AppCtrl', function($scope) {
    $scope.pdf = {
        src: 'demo/example.pdf'
    };
});
```

## Demo

You can test out a demo of this directive. You must run the node server first due to CORS reasons. First make sure the dependencies are installed.

    npm install

Afterwards run the server like so.

    node server.js

The server will be running on localhost:8080
