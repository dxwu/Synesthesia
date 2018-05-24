var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')
var request = require('request');


const hueUserPath = './hue_username.txt';
const hueWaitingUserInput = 'waiting';

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

// Parse local text file for hue username. If none exist, tell the client to 
// press the button on their hue bridge.
app.get('/api/hueuser', function (req, res) {
	if (!fs.existsSync(hueUserPath)) {
		fs.writeFile(hueUserPath, hueWaitingUserInput, { flag: 'wx' }, function (err) {
		    if (err) {
		    	res.status(500).send('Error writting to ' + hueUserPath);
		    	return;
		    }

		    registerHueUser(function(){});
		    res.send(hueWaitingUserInput);
		});
	} else {
		fs.readFile(hueUserPath, 'utf8', function(err, data) {
			if (err) {
		    	res.status(500).send('Error reading ' + hueUserPath);
		    	return;
			}

			res.send(data);
		});
	}
});

// After the client pressed the button on their hue bridge,
// call this endpoint to get the username and write to a file to save for next time
app.get('/api/firsttimehueuser', function (req, res) {
	if (!fs.existsSync(hueUserPath)) {
		res.status(500).send(hueUserPath + ' does not exist');
		return;
	}

	fs.readFile(hueUserPath, 'utf8', function(err, data) {
		if (err) {
	    	res.status(500).send('Error reading ' + hueUserPath);
	    	return;
		}

		if (!data.includes(hueWaitingUserInput)) {
			res.status(500).send(hueUserPath + ' is not in the correct format');
			return;
		}

		registerHueUser(function(body) {
			if (!body || !body[0] || !body[0].success || !body[0].success.username) {
				res.status(500).send('Error creating hue user. Are you sure you pressed the button on the Hue Bridge?');
				return;
			}

			fs.writeFile(hueUserPath, body[0].success.username, function (err) {
			    if (err) {
			    	res.status(500).send('Error writting to ' + hueUserPath);
			    	return;
			    }

				res.send(body[0].success.username);
			});
		});
	});
});

function registerHueUser(callback) {
	request({
				url: 'http://192.168.1.15/api/',
	    		method: "POST",
	    		json: {
    				"devicetype": "my_hue_app#dwu"
	    		}
    		},
    		(err, res, body) => {
				if (err) { 
					return console.log(err); 
				}
				callback(body);
	});
}

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});