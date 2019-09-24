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
let ProfileController = require('./controllers/Profile');
let FavoritesController = require('./controllers/Favorites');
let GroupController = require('./controllers/Groups');
let CreationHandler = require('./database/Create');

//Initialize our endpoint controllers.
let UserControl = new UserController(pool,app);
let SharesControl = new SharesController(pool,app);
let ProfileControl = new ProfileController(pool,app);
let FavoriteControl = new FavoritesController(pool,app);
let GroupControl = new GroupController(pool,app);
let Creation = new CreationHandler(pool,app);

module.exports = app;
