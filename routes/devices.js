const express = require('express');
const router = express.Router();

let Device = require('../models/device');

router.get('/', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err) {
            console.log(err);
            return;
        } else if (devices.length == 0) {
            req.flash('warning', 'There are no devices!');
            res.render('devices', {
                devices: {}
            });
        } else {
            res.render('devices', {
                devices: devices
            });
        }
    });
});

router.get('/add', (req, res) => {
    res.render('add_device');
});

// POST route to add a new device via form
router.post('/add', (req, res) => {
    //#region Check if following fields are empty
    req.checkBody('name', 'Device Name is required').notEmpty();
    req.checkBody('device_type', 'Device Type is required').notEmpty();
    req.checkBody('room_name', 'Room is required').notEmpty();
    req.checkBody('floor', 'Floor is required').notEmpty();
    req.checkBody('mqtt_topic', 'MQTT Topic is required').notEmpty();
    //#endregion
    // Return errors from validation above
    let errors = req.validationErrors();
    if (errors) {
        res.render('add_device', {
            errors:errors
        });
    } else {
       let device = new Device();
       device.name = req.body.name;
       device.deviceType = req.body.device_type;
       device.roomName = req.body.room_name;
       device.floor = req.body.floor;
       device.mqttTopic = req.body.mqtt_topic;
       device.save((err) => {
           if (err) {
               console.log(err);
               return;
           } else {
               req.flash('success', 'Device added');
               res.redirect('/devices');
           }
       });
    }
});

module.exports = router;