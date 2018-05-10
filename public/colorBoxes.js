function changeColors(keyNumber) {
	var boxNum = Math.floor(Math.random() * 4) + 1;
	var boxId = "g" + boxNum;
	var boxElement = document.getElementById(boxId);

	boxElement.style.backgroundColor = getKeyColor(getKey(keyNumber));
}

function registerMidiListener() {
	WebMidi.enable(function (err) {
		if (err) {
			console.log("WebMidi could not be enabled.", err);
			return;
		} 

		var input = WebMidi.inputs[0];
		if (input == null) {
			console.log("Could not find midi input");
			return;
		}

		input.addListener('noteon', "all",
			function (e) {
				changeColors(e.note.number);
			}
		);
	});
}

//registerMidiListener();