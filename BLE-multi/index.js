var colorPicker = new iro.ColorPicker("#picker", {
  width: 250,
  color: "#FF0000",
  borderWidth: 2,
  borderColor: "#888"
});

let colorSlot = 0;
const primaryColor = '#FF0000';
const secondaryColor = '#FFF';
let changeColor = true;

let lastPrimaryColor = [primaryColor, primaryColor, primaryColor, primaryColor, primaryColor, primaryColor, primaryColor, primaryColor];
let lastSecondaryColor = [secondaryColor, secondaryColor, secondaryColor, secondaryColor, secondaryColor, secondaryColor, secondaryColor, secondaryColor];

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))


colorPicker.on(['color:change'], function(color) {
  rgbArray = Object.values(color.rgb);
  setRgbInputs(rgbArray);

  output = document.getElementById('outputSelect').value;
  saveColorVals();

  	// pass to BLE
 	if(changeColor) {
 		rgbString = getRgbString(rgbArray);
 		if(btConnected)  bleSetRgbVals(rgbString, colorSlot, output);
 	} else {
 		changeColor = true;
 	}
});

function onColorSlot(e) {
	e.style.background = '#eee';
	e.style.color = '#666';
	changeColor = false;
	
	let allOutputs = false;
	let output = document.getElementById('outputSelect').value;

	if(output == 0)	allOutputs = true;

	if(e.id == 'secondaryColor') {
		colorSlot = 1;
		if(!allOutputs) {
			lastPrimaryColor[output - 1] = colorPicker.color.hexString;
			colorPicker.color.hexString = lastSecondaryColor[output - 1];
		} else {
			colorPicker.color.hexString = lastSecondaryColor[0];
		}
		document.getElementById('primaryColor').style.background = '#666';
		document.getElementById('primaryColor').style.color = '#eee';
	} else {
		colorSlot = 0;
		if(!allOutputs) {
			lastSecondaryColor[output - 1] = colorPicker.color.hexString;
			colorPicker.color.hexString = lastPrimaryColor[output - 1];
		} else {
			colorPicker.color.hexString = lastPrimaryColor[0];
		}
		document.getElementById('secondaryColor').style.background = '#666';
		document.getElementById('secondaryColor').style.color = '#eee';
	}
}

function saveColorVals() {
	let output = document.getElementById('outputSelect').value;
	console.log('Saving color values on output ' + output + ', color slot ' + colorSlot);
	if(output == 0) output += 1;



	if(colorSlot = 0) {
		lastPrimaryColor[output - 1] = colorPicker.color.hexString;
	} else {
		lastSecondaryColor[output - 1] = colorPicker.color.hexString;
	}
}

function setColorPicker(rgbArray) {
	rgbString = "rgb(";
	rgbString += rgbArray[0].toString();
	rgbString +=", ";
	rgbString += rgbArray[1].toString();
	rgbString +=", ";
	rgbString += rgbArray[2].toString();
	rgbString +=")";

	colorPicker.color.rgbString = rgbString;
}


 function onColorButtonClick(e) {
 	hexColor = e.getAttribute('data-value').toString();
 	rgbColor = hexToRgb(hexColor);
 	
 	setRgbInputs(rgbColor);
 	setColorPicker(rgbColor);

 	// pass to BLE happens in setColorPicker
 }

 function onRgbValChange(e) {
 	colorChangeVal = e.value;
 	rgbArray = [0,0,0];

 	switch(e.getAttribute('id')) {
 		case 'r-input':
 			rgbArray[0] = colorChangeVal;
 			rgbArray[1] = document.getElementById('g-input').value;
 			rgbArray[2] = document.getElementById('b-input').value;
 			break;
 		case 'g-input':
 			rgbArray[0] = document.getElementById('r-input').value;
 			rgbArray[1] = colorChangeVal;
 			rgbArray[2] = document.getElementById('b-input').value;
 			break;
 		case 'b-input':
 			rgbArray[0] = document.getElementById('r-input').value;
 			rgbArray[1] = document.getElementById('g-input').value;
 			rgbArray[2] = colorChangeVal;
 			break;
 	}

 	setColorPicker(rgbArray);
 	//saveColorVals();

 	// pass to BLE
 	rgbString = getRgbString(rgbArray);
 	console.log("Here in RGB input");
 	if(btConnected)  bleSetRgbVals(rgbString, colorSlot);
 }

 function setRgbInputs(rgbArray) {
 	r = rgbArray[0];
 	g = rgbArray[1];
 	b = rgbArray[2];


 	document.getElementById('r-input').value = r;
 	document.getElementById('g-input').value = g;
 	document.getElementById('b-input').value = b;
 }

 function getRgbString(rgbArray) {

 	rgbString =  zeroPad(rgbArray[0],3).toString();
 	rgbString += zeroPad(rgbArray[1],3).toString();
 	rgbString += zeroPad(rgbArray[2],3).toString();

 	return rgbString;
 }

function onAnimationDropdown(val) {
	let description = animations.find(o => o.id == val).description;
	document.getElementById('patternDescription').textContent = description;
 	//document.getElementById('patternGif').innerHTML = '<img src=' + gifLink + val + gifFooter + ' alt />';

 	output = document.getElementById('outputSelect').value;

 	if(btConnected) bleSetPattern(val, output);
}

function onPatternSlider() {
	pattern = document.getElementById('animationDropdown').selectedIndex;
	output = document.getElementById('outputSelect').value;
	//output = e.options[e.selectedIndex].value;

	speed = document.getElementById('patternSpeed').value;
	intensity =  document.getElementById('patternIntensity').value;
	
	console.log('Setting output ' + output + ' pattern ' + pattern + ' speed to ' + speed + '% and intensity to ' + intensity + '%');

	if(btConnected) bleSetPatternConfig(pattern, speed, intensity, output);
}

 function onPowerSwitch(power) {
 	if(!power){  // blackout
 		// dim settings
 		document.getElementById('controls').style.opacity = .2;
 		document.getElementById('controls').style.pointerEvents = "none";
 		document.getElementById('brightness').style.opacity = .2;
 		document.getElementById('brightness').style.pointerEvents = "none";
 		document.getElementById('temperature').style.opacity = .2;
 		document.getElementById('temperature').style.pointerEvents = "none";

 		if(btConnected) bleSetMasterVals('blackout', 1);
 	} else {
 		// undim settings
 		document.getElementById('controls').style.opacity = 1;
 		document.getElementById('controls').style.pointerEvents = "auto";
 		document.getElementById('brightness').style.opacity = 1;
 		document.getElementById('brightness').style.pointerEvents = "auto";
 		document.getElementById('temperature').style.opacity = 1;
 		document.getElementById('temperature').style.pointerEvents = "auto";

 		if(btConnected) bleSetMasterVals('blackout', 0);
 	}
 }

 function onBrightnessSlider(val) {
 	document.getElementById('brightnessPct').innerHTML = "(" + val + "%)";

 	if(btConnected) bleSetMasterVals('brightness', val);
 }

 function onTemperatureSlider(val) {
 	document.getElementById('temperatureK').innerHTML = "(" + val + "K)";

 	if(btConnected) bleSetMasterVals('temperature', val);
 }

function onModeSelect(val) {
	if(btConnected) bleSetOpMode(val);
}

function onOutputSelect(val) {
	changeColor = false;

	if(val == 0) val += 1;

	if(btConnected) bleSetOutput(val);

	if(colorSlot == 0) {
		colorPicker.color.hexString = lastPrimaryColor[val - 1];
	} else {
		colorPicker.color.hexString = lastSecondaryColor[val - 1];
	}

}


function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( num < 0 ) {
        zeroString = '-' + zeroString;
    }

    return zeroString+n;
}

const gifLink = 'https://github.com/photocromax/WLED-live-visualizations/raw/master/GIF/FX_';
const gifFooter = '.gif';

const animations = [
	{'id':0, 'name':'Solid', 'description':'Solid primary color on all LEDs'},
	{'id':1, 'name':'Blink', 'description':'Blinks between primary and secondary color'},
	{'id':12, 'name':'Breathe', 'description':'Fades between primary and secondary color'},
	{'id':3, 'name':'Wipe', 'description':'Switches between primary and secondary, switching LEDs one by one, start to end'},
	{'id':9, 'name':'Rainbow Wave', 'description':'Rainbow wave along the whole strip'},
	{'id':87, 'name':'Rainbow Twinkle', 'description':'Rainbow animation moving down the strip with white twinkles'},
	{'id':63, 'name':'Rainbow Sparkles', 'description':'Rainbow flashes with variable brightness'},
	{'id':13, 'name':'Theater', 'description':'Pattern of one lit and two unlit LEDs running'},
	{'id':28, 'name':'Chase', 'description':'2 LEDs in primary color running on secondary'},
	{'id':89, 'name':'Fireworks', 'description':'Exploding multicolor fireworks'},
	{'id':93, 'name':'Running Trail', 'description':'Moving dots with trail'},
	
];





