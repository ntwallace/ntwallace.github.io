let server;
let masterService;
let rgbService;
let patternService;

let btConnected = false;
let encoder = new TextEncoder('utf-8');

const settingsServiceUUID = '7537fbd5-d66c-4b03-b132-47b1e18285ee';
const masterServiceUUID = '2392fab3-b378-4d6e-a995-3e37a5e7e1da';
const rgbServiceUUID = '2392fab3-b378-4d6e-a995-4e37a5e7e1da';
const patternServiceUUID = '2392fab3-b378-4d6e-a995-5e37a5e7e1da';

async function onBleConnect() {
    try {
        console.log('Requesting list of Bluetooth device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{namePrefix: ['BRIGHTLY']}],
            acceptAllDevices: true,
            optionalServices: [settingsServiceUUID,
                                masterServiceUUID, 
                                rgbServiceUUID,
                                patternServiceUUID]
        });
        device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

        console.log('Connecting to Brightly device...');
        server = await device.gatt.connect();

        console.log('Getting Settings Service...');
        settingsService = await server.getPrimaryService(settingsServiceUUID);

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
    //document.getElementById('connectedText').textContent = 'Connected to Brightly!';

    document.getElementById('main').style.opacity = 1;
    document.getElementById('main').style.pointerEvents = "auto";
    document.getElementById('footer').style.opacity = 1;
    document.getElementById('footer').style.pointerEvents = "auto";

    bleGetOpMode();

    btConnected = true;
}

function onDeviceDisconnected(){
    console.log('Device disconnected');
    resetPage();

    document.getElementById('connectDiv').style.display='flex';
    //document.getElementById('connectedText').textContent = 'Not connected';

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

async function bleGetOpMode() {
    try {
        console.log('Connecting to Op Mode characteristic');
        const characteristic = await settingsService.getCharacteristic('7537fbd5-d66c-4b03-b132-47b1e18281ea');

        const value  = await characteristic.readValue();
        const opMode = value.getUint8(0) - 48;

        console.log('Op Mode on Brightly is ' + opMode);

        document.getElementById('modeSelect').selectedIndex = opMode;

        //return opMode;

    } catch(error) {
        console.log('Error reading Op Mode from Brightly. Error: ' + error);
  }
}

async function bleSetOpMode(opMode) {
    try {
        // console.log('Getting RGB Service...');
        // const service = await server.getPrimaryService(rgbService);

        console.log('Connecting to Op Mode characteristic');
        const characteristic = await settingsService.getCharacteristic('7537fbd5-d66c-4b03-b132-47b1e18281ea');

        console.log('Setting Op Mode to: ' + opMode);

        const value  = await characteristic.writeValue(encoder.encode(opMode));

    } catch(error) {
        console.log('Error setting Op Mode. Error: ' + error);
  }
}

async function bleSetOutput(output) {
    try {

        console.log('Connecting to output characteristic');
        const characteristic = await settingsService.getCharacteristic('7537fbd5-d66c-4b03-b132-47b1e18281eb');

        console.log('Setting output to: ' + output);

        const value  = await characteristic.writeValue(encoder.encode(output));

    } catch(error) {
        console.log('Error setting Op Mode. Error: ' + error);
  }
}

async function bleGetColorSlot() {
    try {

        console.log('Connecting to color slot characteristic');
        const characteristic = await settingsService.getCharacteristic('7537fbd5-d66c-4b03-b132-47b1e18281ec');

        console.log('Color slot is: ' + output);

        const value  = await characteristic.readValue();
        var dec = new TextDecoder("utf-8");
        const slot = dec.decode(value);

    } catch(error) {
        console.log('Error setting Op Mode. Error: ' + error);
  }
}

async function bleSetColorSlot(slot) {
    try {

        console.log('Connecting to color slot characteristic');
        const characteristic = await settingsService.getCharacteristic('7537fbd5-d66c-4b03-b132-47b1e18281ec');

        console.log('Setting color slot to: ' + slot);

        const value  = await characteristic.writeValue(encoder.encode(slot));

    } catch(error) {
        console.log('Error setting color slot. Error: ' + error);
  }
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

async function bleSetRgbVals(rgbString, colorSlot, output) {
    try {
        // console.log('Getting RGB Service...');
        // const service = await server.getPrimaryService(rgbService);

        console.log('Connecting to RGB characteristic');
        const characteristic = await rgbService.getCharacteristic('2392fab3-b378-4d6e-a295-4e37a5e7e1ea');

        console.log('Writing RGB value: ' + rgbString + ' to output: ' + output + ', slot ' + colorSlot);
        val = colorSlot.toString() + rgbString + output.toString();

        const value  = await characteristic.writeValue(encoder.encode(val));

    } catch(error) {
        console.log('Error writing RGB values. Error: ' + error);
  }
}

async function bleGetRgbVals(colorSlot) {
    try {
        console.log('Connecting to RGB characteristic');
        const characteristic = await rgbService.getCharacteristic('2392fab3-b378-4d6e-a295-4e37a5e7e1ea');

        const value  = await characteristic.readValue();
        var dec = new TextDecoder("utf-8");
        const color = dec.decode(value);

        let rgb = [(color >> 16 & 0xFF), (color >> 8 & 0xFF), (color & 0xFF)];

        setColorPicker(rgb);

    } catch(error) {
        console.log('Error getting RGB values. Error: ' + error);
  }
}

async function bleSetPattern(pattern, output) {
    try {

        console.log('Connecting to Pattern characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1eb');

        if(pattern.length < 2) pattern = '0'+ pattern;
        console.log('Writing Pattern ' + pattern + ' to output ' + output);
        const value  = await characteristic.writeValue(encoder.encode(pattern + output));

    } catch(error) {
        console.log('Error writing pattern values. Error: ' + error);
  }
}

async function bleGetPattern(pattern, output) {
    try {

        console.log('Connecting to Pattern RGB characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1eb');

        const value  = await characteristic.readValue();

        var dec = new TextDecoder("utf-8");
        const pattern = dec.decode(value);

        document.getElementById('animationDropdown').value = pattern;

    } catch(error) {
        console.log('Error getting pattern values. Error: ' + error);
  }
}

async function bleSetPatternConfig(pattern, speed, intensity, output) {
    try {

        if(pattern.toString().length < 2) {
            val = encoder.encode('0' + pattern.toString() + speed.toString() + intensity.toString() + output.toString());
        } else {
            val = encoder.encode(pattern.toString() + speed.toString() + intensity.toString() + output.toString());
        }
        console.log('Pattern config string set to ' + val);

        console.log('Connecting to Pattern config characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1ec');

        //console.log('Writing Speed ' + speed + '%');
        const value  = await characteristic.writeValue(val);

    } catch(error) {
        console.log('Error writing pattern config values. Error: ' + error);
  }
}

async function bleSetPatternSpeed(speed, output) {
    try {

        if(speed.toString().length < 2) {
            val = encoder.encode('0' + speed.toString() + output.toString());
        } else {
            val = encoder.encode(speed.toString() + output.toString());
        }

        console.log('Connecting to pattern speed characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1ea');

        //console.log('Writing Speed ' + speed + '%');
        const value  = await characteristic.writeValue(val);

    } catch(error) {
        console.log('Error writing pattern speed values. Error: ' + error);
  }
}

async function bleSetPatternIntensity(intensity, output) {
    try {

        if(intensity.toString().length < 2) {
            val = encoder.encode('0' + intensity.toString() + output.toString());
        } else {
            val = encoder.encode(intensity.toString() + output.toString());
        }

        console.log('Connecting to Pattern intensity characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1ed');

        //console.log('Writing Speed ' + speed + '%');
        const value  = await characteristic.writeValue(val);

    } catch(error) {
        console.log('Error writing pattern intensity values. Error: ' + error);
  }
}

async function bleGetSpeed() {
    try {

        console.log('Connecting to pattern speed characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1ea');

        const value  = await characteristic.readValue();

        var dec = new TextDecoder("utf-8");
        const speed = dec.decode(value);

        console.log("Got speed: " + speed);
        document.getElementById('patternSpeed').value = speed;

    } catch(error) {
        console.log('Error getting speed values. Error: ' + error);
  }
}

async function bleGetIntensity() {
    try {

        console.log('Connecting to pattern intensity characteristic');
        const characteristic = await patternService.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1eb');

        const value  = await characteristic.readValue();

        var dec = new TextDecoder("utf-8");
        const intensity = dec.decode(value);

        console.log("Got intensity: " + intensity);
        document.getElementById('patternIntensity').value = intensity;

    } catch(error) {
        console.log('Error getting intensity values. Error: ' + error);
  }
}
