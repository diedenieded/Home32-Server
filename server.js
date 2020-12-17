const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    console.log("[server] Server started on port " + PORT);
});