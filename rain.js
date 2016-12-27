const Gpio = require('onoff').Gpio;

module.exports = class Rain {

    constructor(gpio, tipAmount) {
    	this.name = "RAIN";
		this.type = "sensor";

		this.valueNames  = ["amount"];
		this.valueTypes  = ["float"];
		this.values      = [0.0];
 		this.callbacks   = [];
 		this.tooSoon     = false;
 		this.constructed = false;

 		// Calculate the min alowable number of seconds between bucket tips
 		// by assuming a max rate of 50mm per hour (0.833/min) divided by
 		// the amount of rain per tip to find the number of tips per minute,
 		// which is then used as a divisor of 60 seconds to achive a minimum
 		// number of seconds between bucket tips
 		this.debouceTime = Math.round(60 / (0.833 / tipAmount)) * 1000;

		this.tipAmount = tipAmount;

        this.bucket = new Gpio(gpio, 'in', 'rising');

        this.bucket.watch((this._bucketTipFunction).bind(this));

        // should we be capturing sigints and exits in order to unexport the pins?
        // process.on('SIGINT', (this._destructor).bind(this));
        // process.on('exit', (this._destructor).bind(this));

        this.active = true;
        this.constructed = true;
    }
    
    _bucketTipFunction(err, val) {
    	if (err) {
    		console.error("Rain Gauge tip interrupt error: " + err);
    		if (this.callbacks[0] !== 'undefined') {
    			this.callbacks[0](err, null);
    		}
    	}
    	else {

    		// If val is 0, then this is the falling edge.  Too soon to the last tip is bad too
    		if ((val) && (!this.tooSoon)) { // because sometimes val is 0 if caught on the falling edge
        		this.values[0] += this.tipAmount;
        		this.tooSoon = true;

        		// call the callback if we've got one
        		if (this.callbacks[0] !== 'undefined') {
					this.callbacks[0](null, this.values[0]);
				}

				// Violent rain — when the precipitation rate is > 50 mm (2.0 in) per hour.
        		var self = this;
        		setTimeout(function() {
        			self.tooSoon = false;
        		}, this.debouceTime);
			}
    	}
    }

    _destructor() {
    	if (this.constructed) {
	    	this.bucket.unwatch();
			this.bucket.unexport();
			this.constructed = false;
		}
		process.exit(0);
    }

    deviceName() {
    	return this.name;
	}

	deviceType() {
		return this.type;
	}

	deviceVersion() {
		return "1.0.0";
	}

	deviceNumValues() {
		return this.valueNames.length;
	}

	typeAtIndex(index) {
		if ((index < 0) || (index > this.valueTypes.length)) {
        	return "none";
    	}
    	else {
			return this.valueTypes[index];
		}
	}

	nameAtIndex(index) {
		if ((index < 0) || (index > this.valueNames.length)) {
        	return "none";
    	}
    	else {
			return this.valueNames[index];
		}
	}

	deviceActive() {
		return this.active;
	}

	valueAtIndexSync(index) {
		if ((index < 0) || (index > this.values.length)) {
        	return "none";
    	}
    	else {
			return this.values[index];
		}
	}

	valueAtIndex(index, callback) {
		var err = null;
		var val = 0;

		if ((index < 0) || (index > this.values.length)) {
			err = "Value Index Out Of Range";
		}
		else {
			val = this.values[index];
		}

		callback(err, val);
	}

	watchValueAtIndex(index, callback) {
		if (this.values[index] !== 'undefined') {
			this.callbacks[index] = callback;
		}
	}

	resetValueAtIndex(index) {
		if (this.values[index] !== 'undefined') {
			this.values[index] = 0;
		}
    }
    
}








