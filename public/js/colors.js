function getKey(keyNumber) {
	switch (keyNumber % 12) {
		case 0: 
			return 'a';
		case 1: 
			return 'a#';
		case 2: 
			return 'b';
		case 3: 
			return 'c';
		case 4: 
			return 'c#';
		case 5: 
			return 'd';
		case 6: 
			return 'd#';
		case 7: 
			return 'e';
		case 8: 
			return 'f';
		case 9: 
			return 'f#';
		case 10: 
			return 'g';
		case 11: 
			return 'g#';
		default:
			return '';
	}
}

// https://en.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res
function getKeyColor(key) {
	if (key == 'c') {
		return 'red';
	}
	if (key == 'c#') {
		return 'purple';
	}
	if (key == 'd') {
		return 'yellow';
	}
	if (key == 'd#') {
		return '#f9b295';
	}
	if (key == 'e') {
		return '#bcfdff';
	}
	if (key == 'f') {
		return '#aa2e2e';
	}
	if (key == 'f#') {
		return '#8edfff';
	}
	if (key == 'g') {
		return 'orange';
	}
	if (key == 'g#') {
		return 'violet';
	}
	if (key == 'a') {
		return 'green';
	}
	if (key == 'a#') {
		return '#ff007f';
	}
	if (key == 'b') {
		return 'blue';
	}
		
	return "#000000";
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}