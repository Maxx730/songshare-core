var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let body = require('body-parser');
let cors = require('cors');
var request = require('request');
app.use(cookieParser());
app.use(body.urlencoded({extended:true}));
app.use(body.json());
app.use(cors());

//Import our different modules so we can create the end point controllers.
let pool = require('./database/Connection');
let UserController = require('./controllers/Users');
let SharesController = require('./controllers/Shares');
let CreationHandler = require('./database/Create');
let Authorization = require('./auth/Authorization.js');
let AuthEndpoint = require('./controllers/Auth.js');

//Initialize our endpoint controllers.
let Authorize = new Authorization(pool,app);
let UserControl = new UserController(pool,app);
let SharesControl = new SharesController(pool,app);
let Creation = new CreationHandler(pool,app);
let AuthEndpoint = new CreationHandler(pool,app);

module.exports = app;
