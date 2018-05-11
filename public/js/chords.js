var keys = new Set();
const MIDI_LOW_A = 21;

// do some testing with this
const BROWSER_REFRESH_MINIMUM_MS = 20;

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
				var keyNumber = e.note.number-MIDI_LOW_A;
				keys.add(keyNumber);
			}
		);

		input.addListener('noteoff', "all",
			function (e) {
				var keyNumber = e.note.number-MIDI_LOW_A;
				keys.delete(keyNumber);
			}
		);
	});
}

function analyzeKeys() {
	setInterval(function() {
		if (keys.size >= 3) {
			// do chord analysis here
			console.log('keys', keys);

		}
	}, 1000);
}

registerMidiListener();
analyzeKeys();