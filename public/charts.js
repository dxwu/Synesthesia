function random_data(alpha){
	return alpha.map(function(d){
		return {
			name: d,
			value: jz.num.randBetween(1, 10)
		}
	});
}

function redraw(data, y_axis, svg, x , y, height, color) {
	var x_var = Object.keys(data[0])[0], y_var = Object.keys(data[0])[1];

	// join
	var bar = svg.selectAll(".bar")
	.data(data, function(d){ return d[x_var]; });

	var amount = svg.selectAll(".amount")
	.data(data, function(d){ return d[x_var]; });

	// update
	bar.transition()
		.attr("y", function(d){ return y(d[y_var]); })
		.attr("height", function(d){ return height - y(d[y_var]); });

	amount.transition()
		.attr("y", function(d){ return y(d[y_var]); })
		.text(function(d){ return d[y_var]; });

	// enter
	bar.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d){ return x(d[x_var]); })
		.attr("y", function(d){ return y(d[y_var]); })
		.attr("width", x.bandwidth())
		.attr("height", function(d){ return height - y(d[y_var]); })
		.attr("fill", function(d){ return color(d[x_var]); });

	amount.enter().append("text")
		.attr("class", "amount")
		.attr("x", function(d){ return x(d[x_var]) + x.bandwidth() / 2; })
		.attr("y", function(d){ return y(d[y_var]); })
		.attr("dy", 16)
		.text(function(d){ return d[y_var]; });
}

function displayBars() {
	var alpha = "abcdefg".split("");

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
		.domain(alpha)
		.padding(.2);

    var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, 10]);

    var x_axis = d3.axisBottom(x);

    var y_axis = d3.axisRight(y)
		.tickSize(width)

    var color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"]);

    redraw(random_data(alpha), y_axis, svg, x, y, height, color);

    d3.interval(function(){
		redraw(random_data(alpha), y_axis, svg, x, y, height, color);
    }, 1000);
}

displayBars();