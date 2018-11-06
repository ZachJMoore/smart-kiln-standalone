//kiln controller

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Kiln = require('../lib/kiln');
const Gpio = require('onoff').Gpio;
const relayOne = new Gpio(27, 'out');

const config = require("../config/config.js")

let kiln = new Kiln({
    relays: [relayOne],
    debug: true,
    config: config
})
kiln.init()

router.get("/get-temp", (req, res) => {
    kiln.getTemp()
    .then(temp => {
        res.send({
            temp: temp
        });
    })
    .catch(error => {
        res.status(503).send(error);
    });
});

router.get("/get-package", (req, res)=>{
    res.send(kiln.getPackage())
})

router.get("/stop-firing", (req, res)=>{
    kiln.stopFiring()
    res.send({message: "Firing stopped"})
})

router.post("/start-firing", (req, res)=>{
    let schedule = req.body.schedule
    if (!schedule) {
        res.send({message:"No schedule provided"})
    } else {
        console.log(schedule.name)
        kiln.startFiring(schedule)
        res.send({message:`schedule ${schedule.name} started successfully`})
    }
})

module.exports = router;