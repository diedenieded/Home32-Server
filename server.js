const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const db_config = require('./config/database');
const PORT = 80;
const PORT_SOCKETIO = 3000;
const app = express();
const socket = require('socket.io');
const server = app.listen(PORT, () => {
    console.log("[home32] Server started on port " + PORT);
});
const io = socket(server);
const mqtt = require('mqtt');
const MQTT_ADDRESS = '192.168.0.109'; // Not localhost because developing on separate machine
const mqttClient = mqtt.connect('mqtt://' + MQTT_ADDRESS, (err) => {
    if (err) console.log(err);
});

mqttClient.on('connect', () => {
    console.log('[home32] Connected to mqtt server on ' + MQTT_ADDRESS);
});

mqttClient.subscribe('devices/+');

/*



    Socket.IO and Device Discovery Section




*/

// This should be made into an array of objects instead, needs to contain deviceCode and deviceType
var deviceCodes = new Array(); // Codes that are randomly generated ONCE by the ESP32 on startup in pairing mode

io.on('connection', (socket) => {
    console.log('[SocketIO] Client has connected');
    socket.on('startDiscovery', () => {
        deviceCodes = new Array();
        deviceCodes = [];
        var timesToEmit = 5;
        let dots = '';
        let discoverInterval = setInterval(() => {
            // Emit message for esp32s to reply to in order to discover them
            timesToEmit--;
            mqttClient.publish('devices/getOpenDevices', 'check');
            dots += '.';
            process.stdout.write(`\r[home32] Discovering devices${dots}`)
            if (timesToEmit == 0) {
                process.stdout.write(`\n`);
                socket.emit('discovered', deviceCodes);
                console.log('[home32] Finished device discovery');
                console.log('[home32] Devices found: ');
                deviceCodes.forEach((d)=> {
                    console.log(d.device_id);
                });
                clearInterval(discoverInterval);
            }
        }, 1000);
    });
});

mqttClient.on('message', (topic, message, packet) => {
    //console.log('[mqtt@' + topic.toString() + '] ' + message.toString());
    if (topic.toString() == 'devices/getOpenDevices' && isJson(message.toString())) {
        let deviceInfo = JSON.parse(message.toString());

        if (!containsObject(deviceInfo, deviceCodes)) {
            deviceCodes.push(deviceInfo);
        }
    }
});

function containsObject(obj, array) {
    for (var x in array) {
        if (array[x].device_id == obj.device_id) {
            return true;
        }
    }
    return false;
}

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}














/*



    Others Section




*/
// Connection to mongodb and error statements
mongoose.connect(db_config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db = mongoose.connection;
db.once('open', () => {
    console.log('[mongoose] Connected to database: home32-db');
});
db.on('error', (err) => {
    console.log('\x1b[31m' + err + '\x1b[0m');
});

// Load View Engine: PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Enable bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set Public Folder, declares 'public' folder as a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// To get the user when accessing any website, used for access control
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Bring in routes
let home = require('./routes/home');
let devices = require('./routes/devices');
let users = require('./routes/users');
const { TIMEOUT } = require('dns');
const { notStrictEqual } = require('assert');
app.use('/home', home);
app.use('/devices', devices);
app.use('/users', users);