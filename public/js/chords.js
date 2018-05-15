/*
0 4 7 - major 
0 4 7 11 - major seventh
0 3 7 - minor
0 3 7 10 - minor seventh
0 3 6 - diminished
0 3 6 (9) - diminished 9
0 4 8 - augmented
0 4 7 10 - dominant seventh
0 4 7 9 - major sixth
0 3 7 9 - minor sixth
*/

var keys = new Set();

// notes -> name
var chords = {};

// chord -> color
var sessionChordColors = {};

var mostRecentChord;

const MIDI_LOW_A = 21;

// do some testing with this
const CHORD_ANALYSIS_MINIMUM_SIZE = 3;

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
				analyzeKeys();
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

// sort, remove duplicates, and bring into 0-12 range
function normalize(notes) {
	var result = new Set();

	notes.forEach(function(element) {
		if (element >= 12) {
			element = element % 12;
		}

		result.add(element);
	});

	return Array.from(result).sort();
}

// generate a chord object (name, notes) given a starting note
// and instructions for generating the chord
function generateChord(start, instructions, name) {
	instructions = instructions.map(n => start + n);
	return {'name': name, 'notes': normalize(instructions)};
}

function addChord(chord) {
	if (chord.notes in chords) {
		chords[chord.notes].push(chord.name);
	} else {
		chords[chord.notes] = [chord.name];
	}
}

function getChords() {
	for (startingNote=0; startingNote<12; startingNote++) {
		addChord(generateChord(startingNote, [0, 4, 7], getKey(startingNote) + ' major'));
		addChord(generateChord(startingNote, [0, 4, 7, 11], getKey(startingNote) + ' major seventh'));
		addChord(generateChord(startingNote, [0, 3, 7], getKey(startingNote) + ' minor'));
		addChord(generateChord(startingNote, [0, 3, 7, 10], getKey(startingNote) + ' minor seventh'));
		addChord(generateChord(startingNote, [0, 3, 6], getKey(startingNote) + ' diminished'));
		addChord(generateChord(startingNote, [0, 3, 6, 9], getKey(startingNote) + ' dimished 9'));
		addChord(generateChord(startingNote, [0, 4, 8], getKey(startingNote) + ' augmented'));
		addChord(generateChord(startingNote, [0, 4, 7, 10], getKey(startingNote) + ' dominant seventh'));
		addChord(generateChord(startingNote, [0, 4, 7, 9], getKey(startingNote) + ' major sixth'));
		addChord(generateChord(startingNote, [0, 3, 7, 9], getKey(startingNote) + ' minor sixth'));
	}
}

function initializeRandomChordColors() {
	for (var key in chords) {
		var name = chords[key];
		sessionChordColors[name] = getRandomColor();
	}
}

function analyzeKeys() {
	if (keys.size >= CHORD_ANALYSIS_MINIMUM_SIZE) {
		var candidate = normalize(keys);
		var chordName = "";

		if (candidate in chords) {
			chordName = chords[candidate];
		} else {
			chordName = candidate.join('-');
		}

		if (mostRecentChord === chordName) {
			return;
		}

		displayChord(chordName);
		mostRecentChord = chordName;
	}
}

function getChordColor(chordName) {
	if (!(chordName in sessionChordColors)) {
		sessionChordColors[chordName] = getRandomColor();
	}

	return sessionChordColors[chordName];
}

function displayChord(chordName) {
	// console.log('chord', chordName);

	var color = getChordColor(chordName);

	// display
	document.body.style.backgroundColor = color;

	// lights
	// TODO: control brightness from midi velocity
	changeLight(getHueColor(color), 254);
}

getChords();
initializeRandomChordColors();
registerMidiListener();