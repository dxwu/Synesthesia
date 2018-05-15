// TODO: get this programmatically
const lightUrl = "http://192.168.1.15/api/fV394S8DUm6Q0bIf3BQ27Ym7o8b7FnPhgVKQUgNV/lights/1/state";

const HUE_ABS_BRIGHTNESS = 254;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {0,0,0};
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

function getHueColor(hex) {
	var rgb = hexToRgb(hex);
	return rgbToCie(rgb.r, rgb.g, rgb.b);
}

function getAbsBrightness(percent) {
	return parseInt(precent * HUE_ABS_BRIGHTNESS);
}

function createRestCall(url) {
	var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url, true);

    //TODO: do we need this?
    xhttp.setRequestHeader("Content-type", "application/json");
    return xhttp;
}

function changeLight(cie, percentBrightness) {
	var absBrightness = getAbsBrightness(percentBrightness);
	var body = '{\
					\"transitiontime\":0, \
					\"xy\":[' + cie[0] + ',' + cie[1] + '], \
					\"bri\": ' + absBrightness + '\
				}';
	var request = createRestCall(lightUrl);
	request.send(body);
}