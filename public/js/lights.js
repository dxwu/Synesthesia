// Philips Hue client, communicates with the server (app.js) and with
// the Hue lights to display colors

const serverUrl = window.location.protocol + '//' + window.location.host;
const HUE_ABS_BRIGHTNESS = 254;

var bridgeIp = "";
var bridgeUser = "";
var colorLights = [];
var numLights = -1;


// Calls the Hue API to display colors based on the chord
// and velocity of the MIDI input.
function changeLight(cies, percentBrightness) {
	var absBrightness = getAbsBrightness(percentBrightness);
	var lightUrls = getChangeLightUrls();
	var requests = [];

	for (var light = 0; light < numLights; light++) {
		var body = `{
						"on": true,
						"transitiontime": 1,
						"xy": [${cies[light][0]}, ${cies[light][1]}],
						"bri": ${absBrightness}
					}`;
		requests.push({call: createRestCall(lightUrls[light], "PUT"), body: body});
	}

	if (getRandomDirection()) {
		for (var r = 0; r < requests.length; r++) {
			var request = requests[r];
			request.call.send(request.body);
		}
	} else {
		for (var r = requests.length-1; r >= 0; r--) {
			var request = requests[r];
			request.call.send(request.body);
		}
	}
}

function createRestCall(url, method) {
	var xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    return xhttp;
}

function getBridgeUrl() {
	var request = createRestCall(serverUrl + '/api/bridgeaddress', "GET");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	bridgeIp = request.responseText;
	    }
	}

	request.send();
}

function getBridgeUser() {
	var request = createRestCall(serverUrl + '/api/hueuser', "GET");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	bridgeUser = request.responseText;
	    }
	}

	request.send();
}

function getColorLights() {
	var request = createRestCall(serverUrl + '/api/colorlights', "GET");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	colorLights = JSON.parse(request.responseText);
        	numLights = colorLights.length;
        	initializeRandomChordColors();
	    }
	}

	request.send();
}

function getChangeLightUrls() {
	var urls = [];
	colorLights.forEach(function(light) {
		urls.push(`http://${bridgeIp}/api/${bridgeUser}/lights/${light}/state`)
	});
	return urls;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r:0, g:0, b:0};
}

// See https://developers.meethue.com/documentation/color-conversions-rgb-xy
function rgbToCie(red, green, blue)
{
	// Apply a gamma correction to the RGB values, which makes the color 
	// more vivid and more the like the color displayed on the screen of your device
	var red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
	var green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
	var blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92); 

	// RGB values to XYZ using the Wide RGB D65 conversion formula
	var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
	var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
	var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

	// Calculate the xy values from the XYZ values
	var x = (X / (X + Y + Z)).toFixed(4);
	var y = (Y / (X + Y + Z)).toFixed(4);

	if (isNaN(x)) {
		x = 0;
	}

	if (isNaN(y)) {
		y = 0;	 
	}

	return [x, y];
}

// The hue light API talks in CIE
function getHueColor(hex) {
	var rgb = hexToRgb(hex);
	return rgbToCie(rgb.r, rgb.g, rgb.b);
}

function getAbsBrightness(percent) {
	return parseInt(percent * HUE_ABS_BRIGHTNESS);
}

// There is a slight lag between changing the color of one lamp
// to changing the color of another. This tries to switch up the 
// "slower" lamp every so often
function getRandomDirection() {
	return (new Date().getTime() % 2) == 0;
}