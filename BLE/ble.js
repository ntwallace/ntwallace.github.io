let server;
let masterService;
let rgbService;
let patternService;

let btConnected = false;
let encoder = new TextEncoder('utf-8');

const masterServiceUUID = '2392fab3-b378-4d6e-a995-3e37a5e7e1da';
const rgbServiceUUID = '2392fab3-b378-4d6e-a995-4e37a5e7e1db';
const patternServiceUUID = '2392fab3-b378-4d6e-a995-5e37a5e7e1da';

async function onBleConnect() {
    try {
        console.log('Requesting list of Bluetooth device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{name: ['BRIGHTLY']}],
            optionalServices: [masterServiceUUID, 
                                rgbServiceUUID,
                                patternServiceUUID]
        });
        device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

        console.log('Connecting to Brightly device...');
        server = await device.gatt.connect();

        console.log('Getting Master LED Service...');
        masterService = await server.getPrimaryService(masterServiceUUID);

        console.log('Getting RGB Service...');
        rgbService = await server.getPrimaryService(rgbServiceUUID);

        console.log('Getting Pattern Service...');
        patternService = await server.getPrimaryService(patternServiceUUID);

        onDeviceConnected();
    } catch(error) {
        console.log('Error connecting to device: ' + error);
  }
}

function onDeviceConnected() {
	console.log('Device connected');
    document.getElementById('connectDiv').style.display='none';
    document.getElementById('connectedText').textContent = 'Connected to Brightly!';

    document.getElementById('main').style.opacity = 1;
    document.getElementById('main').style.pointerEvents = "auto";
    document.getElementById('footer').style.opacity = 1;
    document.getElementById('footer').style.pointerEvents = "auto";

    btConnected = true;
}

function onDeviceDisconnected(){
	console.log('Device disconnected');
	resetPage();

	document.getElementById('connectDiv').style.display='flex';
    document.getElementById('connectedText').textContent = 'Not connected';

    document.getElementById('main').style.opacity = .2;
    document.getElementById('main').style.pointerEvents = "none";
    document.getElementById('footer').style.opacity = .2;
    document.getElementById('footer').style.pointerEvents = "none";

    btConnected = false;
}

function resetPage(){
	rgbArray = [255, 0, 0];
	setRgbInputs(rgbArray);
	setColorPicker(rgbArray);

	document.getElementById('animationDropdown').value = 0;
}

async function bleSetMasterVals(type, val) {
    try {
        // console.log('Getting Master LED Service...');
        // const service = await server.getPrimaryService(masterService);

        switch(type) {
            case 'blackout':
                console.log('Connecting to ' + type + ' characteristic');
                const blackoutCharacteristic = await masterService.getCharacteristic('2392fab3-b378-4d6e-a195-3e37a5e7e1ea');

                val = val.toString();
                console.log('Writing ' + type + ' value: ' + val);
                const blackoutValue  = await blackoutCharacteristic.writeValue(encoder.encode(val));
                break;
            case 'brightness':
                console.log('Connecting to ' + type + ' characteristic');
                const brightnessCharacteristic = await masterService.getCharacteristic('2392fab3-b378-4d6e-a195-3e37a5e7e1eb');

                val = val.toString();
                console.log('Writing ' + type + ' value: ' + val);
                const brightnessValue  = await brightnessCharacteristic.writeValue(encoder.encode(val));
                break;
            case 'temperature':
                console.log('Connecting to ' + type + ' characteristic');
                const temperatureCharacteristic = await masterService.getCharacteristic('2392fab3-b378-4d6e-a195-3e37a5e7e1ec');

                val = val.toString();
                console.log('Writing ' + type + ' value: ' + val);
                const temperatureValue  = await temperatureCharacteristic.writeValue(encoder.encode(val));
                break;
        }
    } catch(error) {
        console.log('Error writing to master ' + type + '. Error: ' + error);
  }
}

async function bleSetRgbVals(rgbString, colorSlot) {
    try {
        // console.log('Getting RGB Service...');
        // const service = await server.getPrimaryService(rgbService);

        console.log('Connecting to RGB characteristic');
        const characteristic = await rgbService.getCharacteristic('2392fab3-b378-4d6e-a295-4e37a5e7e1ec');

        console.log('Writing RGB value: ' + rgbString + ' to slot: ' + colorSlot);
        val = colorSlot.toString() + rgbString;

        const value  = await characteristic.writeValue(encoder.encode(val));

    } catch(error) {
        console.log('Error writing RGB values. Error: ' + error);
  }
}

async function bleSetPattern(pattern) {
    try {
        // console.log('Getting Pattern Service...');
        // const service = await server.getPrimaryService(patternService);

        console.log('Connecting to Pattern RGB characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1eb');

        console.log('Writing Pattern ' + pattern);
        const value  = await characteristic.writeValue(encoder.encode(pattern));

    } catch(error) {
        console.log('Error writing RGB values. Error: ' + error);
  }
}

async function bleSetPatternSpeed(speed) {
    try {
        // console.log('Getting Pattern Service...');
        // const service = await server.getPrimaryService(patternService);

        console.log('Connecting to Pattern Speed characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1ea');

        console.log('Writing Speed ' + speed + '%');
        const value  = await characteristic.writeValue(encoder.encode(speed));

    } catch(error) {
        console.log('Error writing pattern speed values. Error: ' + error);
  }
}
