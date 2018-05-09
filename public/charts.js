
// this function should be called when a key is pressed down
// modify to take into account keys that were pressed down in the past but have not been released yet
function processInput(keys, keyNumber, keyValue) {
	var newKeys = keys.map(function(k){
		return {
			note: k,
			value: 0
		}
	});

	newKeys[keyNumber].value = keyValue;

	return newKeys;
}

function redraw(data, y_axis, svg, x , y, height) {
	var x_var = Object.keys(data[0])[0], y_var = Object.keys(data[0])[1];

	// join
	var bar = svg.selectAll(".bar")
		.data(data, function(d){ return d.note; });

	var amount = svg.selectAll(".amount")
		.data(data, function(d){ return d.note; });

	// update
	bar.transition()
		.duration(1)
		.attr("y", function(d){ return y(d.value); })
		.attr("height", function(d){ return height - y(d.value); });

	amount.transition()
		.duration(1)
		.attr("y", function(d){ return y(d.value); });

	// enter
	bar.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d){ return x(d.note); })
		.attr("y", function(d){ return y(d.value); })
		.attr("width", x.bandwidth())
		.attr("height", function(d){ return height - y(d.value); })
		.attr("fill", function(d){ return getKeyColor(getKey(d.note)); });
}

function displayBars() {
	var keys = [];
	for (i=1; i<=88; i++) {
		keys.push(i);
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
		.domain(keys)
		.padding(.1);

    var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, 10]);

    var x_axis = d3.axisBottom(x);

    var y_axis = d3.axisRight(y)
		.tickSize(width)

	document.body.addEventListener('keypress', function(e) {
		redraw(processInput(keys, e.keyCode % 88, 10), y_axis, svg, x, y, height);
	});
}	

displayBars();