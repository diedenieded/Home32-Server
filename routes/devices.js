const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

let Device = require('../models/device');

// GET route to show devices page
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

// GET route to show add device page
router.get('/add', (req, res) => {
    if (Object.keys(req.query).length == 0) {
        res.render('add_device');
    } else {
        res.render('autoadd_device', {
            deviceType: req.query.devicetype,
            deviceId: req.query.deviceid
        });
    }
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

// GET route to show configure device page
router.get('/:id/configure', (req, res) => {
    Device.findById(req.params.id, (err, device) => {
        res.render('configure_device', {
            device: device
        });
    });
});

// POST route to submit configuration changes
router.post('/:id/configure', (req, res) => {
    let device = {};
    device.name = req.body.name;
    device.deviceType = req.body.device_type;
    device.roomName = req.body.room_name;
    device.floor = req.body.floor;
    device.mqttTopic = req.body.mqtt_topic;
    let query = {_id:mongoose.Types.ObjectId(req.params.id)}
    Device.updateOne(query, device, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Changes have been saved');
            res.redirect('/devices');
        }
    });
});

// GET route to delete entry, will redirect to /devices
router.get('/:id/delete', (req, res) => {
    let query = {_id:req.params.id};
    Device.findById(req.params.id, (err, device) => {
        Device.deleteOne(query, (err) => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Device has been deleted');
                res.redirect('/devices');
            }
        });
    });
});

// Get route to show device discovery page
router.get('/discovery', (req, res) => {
    res.render('device_discovery');
});

// POST route to get device chosen and redirect to autoadd_deivce with prefilled information
router.post('/discovery', (req, res) => {

});

module.exports = router;