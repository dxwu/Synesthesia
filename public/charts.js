var keys = [];
for (i=0; i<=88; i++) {
	keys.push({'note':i, 'value':0});
}

const HIDDEN_NOTE_NUMBER = 88;
const MIDI_LOW_A = 21;
const MIDI_MAX_RAW_VELOCIY = 127;

// set y-axis max height, this key will be invisible and outside the normal piano range
keys[HIDDEN_NOTE_NUMBER].value = MIDI_MAX_RAW_VELOCIY - 27; 


function setKeyValue(on, keyNumber, keyValue) {
	if (on) {
		keys[keyNumber - MIDI_LOW_A].value = keyValue;
	} else {
		keys[keyNumber - MIDI_LOW_A].value = 0;
	}
	return keys;
}

function redraw(data, y_axis, svg, x , y, height) {
	var x_var = Object.keys(data[0])[0], y_var = Object.keys(data[0])[1];

	// join
	var bar = svg.selectAll(".bar")
		.data(data, function(d) { return d.note; });

	var amount = svg.selectAll(".amount")
		.data(data, function(d) { return d.note; });

	// update
	bar.transition()
		.duration(1)
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d){ return height - y(d.value); });

	amount.transition()
		.duration(1)
		.attr("y", function(d) { return y(d.value); });

	// enter
	bar.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.note); })
		.attr("y", function(d) { return y(d.value); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.value); })
		.attr("fill", function(d) { 
			if (d.note == HIDDEN_NOTE_NUMBER) {
				return '#000000';	
			}
			return getKeyColor(getKey(d.note)); 
		});
}

function displayBars() {
	var domain = [];
	for (i=0; i<=88; i++) {
		domain.push(i);
	}

    var setup = d3.marcon()
        .top(20)
        .bottom(20)
        .left(10)
        .right(10)
        .width(window.innerWidth)
        .height(window.innerHeight);

    setup.render();

    var width = setup.innerWidth(), height = setup.innerHeight(), svg = setup.svg();

    var x = d3.scaleBand()
		.rangeRound([0, width])
		.domain(domain)
		.padding(.1);

    var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, MIDI_MAX_RAW_VELOCIY]);

    var x_axis = d3.axisBottom(x);

    var y_axis = d3.axisRight(y)
		.tickSize(width)

	registerMidiListener(y_axis, svg, x, y, height);
}	

function registerMidiListener(y_axis, svg, x, y, height) {
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
				redraw(setKeyValue(true, e.note.number, e.rawVelocity), y_axis, svg, x, y, height);
			}
		);

		input.addListener('noteoff', "all",
			function (e) {
				redraw(setKeyValue(false, e.note.number), y_axis, svg, x, y, height);
			}
		);
	});
}

displayBars();