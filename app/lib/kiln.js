const max31855 = require('./max31855');
const thermoSensor = new max31855();
const fs = require("fs")

ROOT_APP_PATH = fs.realpathSync('.');
console.log(`Root App File Path: ${ROOT_APP_PATH}`);

// PID Constructor Passed Object:
// {
//     temperatureOffset: 0, // Temperature Offset used for calibrating thermocouple
//     setRelays: this.kiln.setRelays, // function which receives a 1 or 0 to turn on or off the relays
//     temperature: this.kiln.temperature, // pass a reference to the temperature of the kiln
//     debug: false
// }

class PID {
    constructor(object) {
        this.target = 0
        this.temperature = object.temperature
        this.temperatureOffset = object.temperatureOffset || 0
        this.setRelays = object.setRelays // pass this function a 1 or 0 to turn on or off the relays
        this.debug = object.debug || false
        this.PIDInterval

        this.holdTarget = () => {
            clearInterval(this.PIDInterval)
            this.PIDInterval = setInterval(() => {

                if ((this.temperature - this.temperatureOffset) >= this.target) {
                    this.setRelays(0)
                }

                if ((this.temperature - this.temperatureOffset) < this.target) {
                    this.setRelays(1)
                }

                this.debug && console.log("Temperature: ", this.temperature, "Target: ", this.target)

            }, 1000)
        }

        this.setTarget = (target) => {
            this.target = target
        }

        this.increaseTarget = (increase) => {
            this.target = this.target = increase
        }

        this.startPID = () => {
            clearInterval(this.PIDInterval)
            this.holdTarget()
        }

        this.stopPID = () => {
            clearInterval(this.PIDInterval)
            this.setRelays(0)
        }

    }
}


// Kiln Class Constructor Object example

// {
//     relays: ["relays", "hooked", "to", "kiln"],
//     debug: false,
//     config: config // see config/default-config.json
// }

class Kiln {
    constructor(object) {
        this.temperature = 0
        this.isFiring = false
        this.currentSchedule = {}
        this.temperatureLog = []
        this.controller = null
        this.relays = object.relays
        this.startupDate = Date.now()
        this.config = object.config
        this.debug = object.debug

        this.getTemp = () => {
            return new Promise((resolve, reject) => {
                thermoSensor.readTempC((temperature) => {
                    //if invalid reading, reject
                    if (isNaN(temperature)) {
                        reject("thermocouple may be broken or not attached");
                    } else {
                        //else, resolve temperature converted to fahrenheit
                        let temperatureF = parseFloat(((temperature * 1.8) + 32).toFixed(2))
                        resolve(temperatureF)
                    }
                })
            })
        }

        this.getPackage = () => {
            return {
                temperature: this.temperature,
                isFiring: this.isFiring,
                currentSchedule: this.currentSchedule,
                temperatureLog: this.temperatureLog
            }
        }

        this.setRelays = (value) => {

            value === 1 ? value = true : value = false

            this.relays.forEach(relay => {
                relay.writeSync(value)
            })
        }

        this.startFiring = (firingSchedule) => {

            if (this.isFiring !== true ){

                this.isFiring = true
                this.currentSchedule = firingSchedule
                this.firingScheduleInstance = this.fireSchedule(schedule)
                this.firingScheduleInstance.next()

            }

        }

        this.stopFiring = ()=>{
            this.isFiring = false
            this.controller.stopPID()
        }

        this.fireSchedule = function* (schedule){
            if (!schedule){
                return
            }

            this.controller.setTarget(this.temp)
            this.controller.startPID()

            let endFiring = () => {
                clearInterval(this.increaseInterval)
                clearInterval(this.firingScheduleCheckInterval)
                clearTimeout(this.holdTimeout)
                this.controller.stopPID()
                this.stopFiring()
            }

            for (ramp in schedule.ramps){

                let isDownRamp = false
                let difference = ramp.target - this.temperature

                if (Math.sign(difference) === -1){
                    isDownRamp = true;
                    difference = Math.abs(difference)
                }

                let risePerSecond = (difference / ramp.rate) * 60 * 60

                if (isDownRamp){
                    risePerSecond = -risePerSecond
                }

                if (this.debug){
                    console.log("Current Temperature: ", this.temperature)
                    console.log("Target Temperature: ", ramp.target)
                    console.log("Rise Per Second: ", risePerSecond)
                }

                this.increaseInterval = setInterval(()=>{

                    if (!isDownRamp){

                        if (this.temperature < ramp.target){
                            this.controller.increaseTarget(risePerSecond)
                        } else {
                            clearInterval(this.increaseInterval)
                            this.controller.setTarget(ramp.target)
                            this.holdTimeout = setTimeout(()=>{

                                if (this.firingScheduleInstance.next().done){
                                    endFiring()
                                    this.debug && console.log("Firing Completed")
                               }

                            },(ramp.hold*60*60*1000))
                        }

                    } else {

                        if (this.temperature > ramp.target){
                            this.controller.increaseTarget(risePerSecond)
                        } else {
                            clearInterval(this.increaseInterval)
                            this.controller.setTarget(ramp.target)
                            this.holdTimeout = setTimeout(()=>{

                                if (this.firingScheduleInstance.next().done){
                                    endFiring()
                                    this.debug && console.log("Firing Completed")
                               }

                            },(ramp.hold*60*60*1000))
                        }

                    }

                }, 1000)

                this.firingScheduleCheckInterval = setInterval(()=>{

                    if (this.isFiring === false){
                        endFiring()
                    }

                }, 2000)

                yield
            }
        }

        this.init = () => {
            this.setRelays(0) //set all relays off
            this.controller = new PID({
                temperatureOffset: this.config.temperatureOffset,
                setRelays: this.setRelays,
                temperature: this.temperature,
                debug: this.debug
            })

            setInterval(() => {

                this.getTemp()
                    .then(temperature => {
                        this.temperature = temperature
                    })
                    .catch(console.log)

            }, 1000)

            setTimeout(() => {
                this.temperatureLog.push(this.temperature)
            }, 2000)

            setInterval(() => {
                if (this.temperatureLog.length < 60) {
                    this.temperatureLog.unshift(this.temperature)
                } else {
                    this.temperatureLog.unshift(this.temperature)
                    this.temperatureLog.pop()
                }
            }, 60000)
        }
    }
}

module.exports = Kiln