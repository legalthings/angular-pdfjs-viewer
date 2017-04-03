# PDF.js viewer Angular directive

Embed Mozilla's [PDF.js](https://mozilla.github.io/pdf.js/) viewer into your angular application, maintaining that look and feel
of pdf's we all love. The directive embeds the [full viewer](https://mozilla.github.io/pdf.js/web/viewer.html), which
allows you to scroll through the pdf.

## Installation

     bower install angular-pdfjs-viewer --save

## Usage

Below you will find a basic example of how the directive can be used.
Note that the order of the scripts matters. Stick to the order of dependencies as shown in the example below.
Also note that images, translations and such are being loaded from the `web` folder.

### View
```html
<!DOCTYPE html>
<html ng-app="app" ng-controller="AppCtrl">
    <head>
        <title>Angular PDF.js demo</title>
        <script src="bower_components/pdf.js-viewer/pdf.js"></script>
        <link rel="stylesheet" href="bower_components/pdf.js-viewer/viewer.css">

        <script src="bower_components/angular/angular.js"></script>
        <script src="bower_components/angular-pdfjs-viewer/dist/angular-pdfjs-viewer.js"></script>
        <script src="app.js"></script>

        <style>
          html, body { height: 100%; width: 100%; margin: 0; padding: 0; }
          .some-pdf-container { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div class="some-pdf-container">
            <pdfjs-viewer src="{{ pdf.src }}"></pdfjs-viewer>
        </div>
    </body>
</html>
```

### Controller
```js
angular.module('app', ['pdfjsViewer']);

angular.module('app').controller('AppCtrl', function($scope) {
    $scope.pdf = {
        src: 'example.pdf',
    };
});
```

## Directive options
The `<pdfjs-viewer>` directive takes the following options.

| Attribute(s)  | Description   |
| ------------- |---------------|
| src | The `src` should point to the URL of a pdf. This pdf has to be publicly available and should return Content-Type `application/pdf`. The `src` is passed in as an interpolation string, like `src="{{ pdf.src }}"`. |
| data | In the case that the pdf isn't publicly available you can pass in raw data as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) object. See the [demo folder](https://github.com/legalthings/angular-pdfjs-viewer/tree/master/demo) for an example of this. The `data` attribute takes a scope variable as its argument, like `data="pdf.data"`. |
| scale | The `scale` attribute can be used to obtain the current scale (zoom level) of the PDF. This is read only. |
| download, print, open | These buttons can be hidden by adding, for example `download="false"` Omitting these attributes will by default show the buttons in the toolbar. |
| on-init | The `on-init` function is called when PDF.JS is fully loaded. |
| on-page-load | The `on-page-load` function is each time a page is loaded and will pass the page number. When the scale changes all pages are unloaded, so `on-page-load` will be called again for each page. _If `onPageLoad()` returns `false`, the page will not be marked as loaded and `onPageLoad` will be called again for that page on the next (200ms) interval._ |

## Styling
Note that the `<pdfjs-viewer>` directive automatically expands to the height and width of its first parent, in this case `.some-pdf-container`
If no parent container is given the `body` will be used. Height and width are required to properly display the contents of the pdf.

## Demo

You can test out a [demo](https://github.com/legalthings/angular-pdfjs-viewer/tree/master/demo) of this directive.
You must run the node server first due to CORS. First make sure the dependencies are installed.

    cd demo
    npm install
    bower install

Afterwards run the server like so.

    node server.js

The server will be running on localhost:8080

## Advanced configuration

By default the location of PDF.js assets are automatically determined. However if you place them on alternative
locations they may not be found. If so, you can configure these locations.

You may disable using the [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).
This is useful if you want to add pdf.worker.js to your concatinated JavaScript file. However this will have a
negative effect on the runtime performance.

    angular.module('app').config(function(pdfjsViewerConfigProvider) {
      pdfjsViewerConfigProvider.setWorkerSrc("/assets/pdf.js-viewer/pdf.worker.js");
      pdfjsViewerConfigProvider.setCmapDir("/assets/pdf.js-viewer/cmaps");
      pdfjsViewerConfigProvider.setImageDir("/assets/pdf.js-viewer/images");
      
      pdfjsViewerConfigProvider.disableWorker();
      pdfjsViewerConfigProvider.setVerbosity("infos");  // "errors", "warnings" or "infos"
    });

Note that a number of images used in the PDF.js viewer are loaded by the `viewer.css`. You can't configure these
through JavaScript. Instead you need to compile the `viewer.less` file as

    lessc --global-var='pdfjsImagePath=/assets/pdf.js-viewer/images' viewer.less viewer.css
