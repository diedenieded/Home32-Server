const mongoose = require('mongoose');
// Creating the device schema
let DeviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Home32 Device'
    }, 
    deviceType: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true,
        default: 1
    },
    mqttTopic: {
        type: String,
        required: true
    }
});

const Device = module.exports = mongoose.model('Device', DeviceSchema);