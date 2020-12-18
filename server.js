const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const db_config = require('./config/database');
const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
    console.log("[home32] Server started on port " + PORT);
});

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
app.use('/home', home);
app.use('/devices', devices);
app.use('/users', users);