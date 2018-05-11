var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/webmidi/'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/html/index.html'));
});

app.get('/grid', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/html/grid.html'));
});

app.get('/keys', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/html/charts.html'));
});

app.get('/lights', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/html/lights.html'));
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});