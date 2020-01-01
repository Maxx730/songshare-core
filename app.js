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
app.post('/test',(req,res) => {
  res.json({
    body: req.body
  })
  res.end();
})

module.exports = app;
