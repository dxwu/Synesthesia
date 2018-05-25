const groupName = 'synlightshow';
var bridgeGroupsApi = `http://${bridgeIp}/api/${bridgeUser}/groups`;

function createGroup() {
	var request = createRestCall(bridgeGroupsApi, "POST");
	var lightString = colorLights.map(l => `"${l}"`).join(',');
	var body = `{
				    "name": "${groupName}",
				    "type": "Room",
				    "class": "Living room",
				    "lights": [
				        ${lightString}
				    ]
				}`;
	console.log('body', body);
	request.send(body);
}

function groupExists() {
	var request = createRestCall(bridgeGroupsApi, "GET");
	request.onreadystatechange = function() {
	    if (request.readyState == XMLHttpRequest.DONE) {
        	return request.responseText.includes(groupName);
	    }
	}

	request.send();
}