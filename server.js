var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').Server(app);

app.use(cors());
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/demo/index.html');
});

server.listen(8080, function () {
    console.log('Server is listening on localhost:8080');
});
