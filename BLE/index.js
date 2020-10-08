var colorPicker = new iro.ColorPicker("#picker", {
  width: 300,
  color: "#fff",
  borderWidth: 2,
  borderColor: "#888"
});

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))


colorPicker.on(['color:change'], function(color) {
  rgbArray = Object.values(color.rgb);
  setRgbInputs(rgbArray);

  	// pass to BLE
 	rgbString = getRgbString(rgbArray);
 	if(btConnected)  bleSetRgbVals(rgbString);
});

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

 	// pass to BLE
 	rgbString = getRgbString(rgbColor);
 	if(btConnected)  bleSetRgbVals(rgbString);
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

 	// pass to BLE
 	rgbString = getRgbString(rgbArray);
 	if(btConnected)  bleSetRgbVals(rgbString);
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
 	document.getElementById('patternGif').innerHTML = '<img src=' + gifLink + val + gifFooter + ' alt />';

 	rgbString =  zeroPad(document.getElementById('r-input').value, 3);
 	rgbString += zeroPad(document.getElementById('g-input').value, 3);
 	rgbString += zeroPad(document.getElementById('b-input').value, 3);

 	val = zeroPad(val, 2).toString();

 	if(btConnected) bleSetPattern(val, rgbString);
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

 		if(btConnected) bleSetMasterVals('blackout', power);
 	} else {
 		// undim settings
 		document.getElementById('controls').style.opacity = 1;
 		document.getElementById('controls').style.pointerEvents = "auto";
 		document.getElementById('brightness').style.opacity = 1;
 		document.getElementById('brightness').style.pointerEvents = "auto";
 		document.getElementById('temperature').style.opacity = 1;
 		document.getElementById('temperature').style.pointerEvents = "auto";

 		if(btConnected) bleSetMasterVals('blackout', power);
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
	{'id':2, 'name':'Breathe', 'description':'Fades between primary and secondary color'},
	{'id':3, 'name':'', 'description':''},
	{'id':4, 'name':'', 'description':''},
	{'id':5, 'name':'', 'description':''},
	{'id':6, 'name':'', 'description':''},
	{'id':7, 'name':'', 'description':''},
	{'id':8, 'name':'', 'description':''},
	{'id':9, 'name':'', 'description':''},
	{'id':10, 'name':'', 'description':''},
	{'id':11, 'name':'', 'description':''},
	{'id':12, 'name':'', 'description':''},
	{'id':13, 'name':'', 'description':''},
	{'id':14, 'name':'', 'description':''},
	{'id':15, 'name':'', 'description':''},
	{'id':16, 'name':'', 'description':''},
	{'id':17, 'name':'', 'description':''},
	{'id':18, 'name':'', 'description':''},
	{'id':19, 'name':'', 'description':''},
	{'id':20, 'name':'', 'description':''},
];





