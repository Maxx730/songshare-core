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
let FavoritesController = require('./controllers/Favorites')

//Initialize our endpoint controllers.
let UserControl = new UserController(pool,app);
let SharesControl = new SharesController(pool,app);
let ProfileControl = new ProfileController(pool,app);
let FavoriteControl = new FavoritesController(pool,app);



function AddToFriends(user_id,friend_id,callback){
  pool.query("INSERT INTO friends(user_id,friend_id) VALUES("+user_id+","+friend_id+")",(err,result,fields) => {
    if(!err){
      console.log("SUCCESS: ADDED USER TO FRIENDS TABLE")
      callback()
    }else{
      console.log(err)
      console.log("ERROR: PROBLEM ADDING USER TO FRIENDS")
    }
  })
}

module.exports = app;
