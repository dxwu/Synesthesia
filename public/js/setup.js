const serverUrl = window.location.protocol + '//' + window.location.host;

function createRestCall(url, method) {
	var xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    return xhttp;
}

function isHueUserCreated(callback) {
	var request = createRestCall(serverUrl + '/api/hueuser', "GET");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	callback(request.responseText.length > 'waiting'.length);
	    }
	}

	request.send();
}

function setVisibility(hasUser) {
	if (hasUser) {
		document.getElementById('hasUser').style.visibility  = 'visible'; 
		document.getElementById('startButton').style.visibility  = 'visible'; 
	} else {
		document.getElementById('noUser').style.visibility  = 'visible'; 
		document.getElementById('setupUserButton').style.visibility  = 'visible'; 
	}
}

function onLoad() {
	isHueUserCreated(setVisibility);
	isMidiConnected(setMidiStatus);
	getNumberLights();
}

function onHueBridgeButtonPressed() {
	var request = createRestCall(serverUrl + '/api/createhueuser', "GET");

	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	if (request.status == 200) {
        		document.getElementById('noUser').style.visibility  = 'hidden'; 
        		document.getElementById('setupUserButton').style.visibility  = 'hidden'; 
        		document.getElementById('hasUser').style.visibility  = 'visible'; 
        		document.getElementById('startButton').style.visibility  = 'visible'; 
        	} else {
        		var comment = 'There was an error when trying to connect this app to your Philips Hue bulbs: ' + request.responseText;
    		    var newParagraph = document.createElement('p');
    		    newParagraph.style.color = 'red';
    		    newParagraph.textContent = comment;
    		    document.getElementById('setupError').appendChild(newParagraph);
        	}
	    }
	}

	request.send();
}

function onStartPressed() {
	window.location.href = "/lights";
}

function isMidiConnected(callback) {
	window.setInterval(checkMidiConnected(callback), 1000);
}

function checkMidiConnected(callback) {
	WebMidi.enable(function (err) {
		if (err) {
			console.log("WebMidi could not be enabled.", err);
		} 

		var input = WebMidi.inputs[0];
		if (input == null) {
			console.log("Could not find midi input");
		}

		callback(!err && input != null);
	});
}

function setMidiStatus(midiOn) {
	if (midiOn) {
		document.getElementById('midiOn').style.visibility  = 'visible'; 
	} else {
		document.getElementById('midiOff').style.visibility  = 'visible'; 
	}
}

function getNumberLights() {
	var request = createRestCall(serverUrl + '/api/colorlights', "GET");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	var colorLights = JSON.parse(request.responseText);
        	var numLights = colorLights.length;
        	document.getElementById('numLights').textContent += numLights.toString();
	    }
	}

	request.send();
}

window.onload = onLoad;