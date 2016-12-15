##Node class module for Momentary On Switch Tipping Bucket Rain Gauge

#####This class module should work on any Linux platform, and has been thoroughly tested on BBB

###Install

```
npm install @agilatech/rain
```
OR
```
git clone https://github.com/Agilatech/rain.git
```

###Usage
#####Load the module and create an instance
```
const driver = require('@agilatech/rain');

// The constructor has two required parameters: 
// 1) GPIO pin number, 2) volume of rain per bucket tip

// create an instance for GPIO 60 with a tip volume of 0.254mm 
const rain = new Rain(60, 0.254);
```
#####Get basic device info
```
const name = rain.deviceName();  // returns string with name of device
const type = rain.deviceType();  // returns string with type of device
const version = rain.deviceVersion(); // returns this software version
const active = rain.deviceActive(); // true if active, false if inactive
const numVals =  rain.deviceNumValues(); // returns the number of paramters sensed
```
####Get parameter info and values
```
// given a parameter index, these return parameter info
const paramName0 = rain.nameAtIndex(0);
const paramType0 = rain.typeAtIndex(0);
const paramVal0  = rain.valueAtIndexSync(0);
```
####Asynchronous value collection is also available
```
//valueAtIndex(index, callback)
rain.valueAtIndex(0, function(err, val) {
    if (err) {
        console.error(err);
    }
    else {
        console.log(`Asynchronous call return: ${val}`);
    }
});
```
####Watch for value changes
```
// watchValueAtIndex(index, callback)
rain.watchValueAtIndex(0, function(err, val) {
	if (!err) {
		console.log("Rain amount is now : " + val);
	}
});
```
####Reset the value to 0
```
//resetValueAtIndex(index)
rain.resetValueAtIndex(0);
```

###Operation Notes
This class module is a driver for a generic tipping bucket rain gauge which employs a momentary-on switch.  In this sort of device, a small bucket collects water until a certain defined weight is reached, at which time the bucket tips, emptying the water and pulsing the switch along the way.  The switch activation can be used to trigger an input event on a GPIO pin.  This pulse on this GPIO pin is then used to register the bucket tip with the computer.

This driver listens for a bucket tip pulse event. On a bucket tip event, the rain amount total is incremented, and any downstream watchers are notified via their callback routine.

Switch bounce can be a problem for these devices. Regardless of the cause (dirty switch contancts, wind shake bucket tippings, etc.), spurious tip events can result in inflated rain totals.  This driver attempts to eliminate many of the causes by simply rejecting pulses which occur to close in time.  A violent rain storm of monsoon propotions can drop 50mm (2 inches) per hour.  This maximum rate of 50mm per hour is used to calculate the minimum time between bucket tips, and any pulse event faster than this is ignored as an anomoly. 

This module assumes use in a Linux operating system, and requires the GPIO pins to be controlled by the sysfs filesystem.  Since it manipulates sysfs files, normal O/S users will not have permission to run this module directly.  It is therefore up to the program operator to insure that O/S-level permissions are in place before this module is loaded and run.
  

###Dependencies
* onoff is employed for event listening 


###Copyright
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

