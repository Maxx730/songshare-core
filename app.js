var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let body = require('body-parser');
let cors = require('cors');

app.use(cookieParser());
app.use(body.urlencoded({extended:true}));
app.use(body.json());
app.use(cors());

let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit:100,
    host:'localhost',
    user:'root',
    password:'dRmario',
    database:'songshare'
});

CheckUserExists = (username,email,password,callback) => {
  console.log(email)
  if(typeof username != "undefined" && username != "" && typeof email != "undefined" && email != ""){
    pool.query("SELECT * FROM users WHERE username='"+username+"'",(err,result,fields) => {
      if(result.length == 0 && !err){
        pool.query("SELECT * FROM users WHERE email='"+email+"'",(err,results,fields) => {
          if(results.length == 0 && !err){
            pool.query('INSERT INTO users(username,password,email) VALUES("'+username+'","'+password+'","'+email+'")',(err,result,fields) => {
              if(!err){
                console.log("USER CREATED")
                callback(
                  {
                    STATUS:"SUCCESS",
                    MESSAGE:"USER CREATED"
                  }
                )
              }else{
                console.log("ERROR CREATING USER")
              }
            })
          }else{
            console.log("ERROR CREATING USER")
          }
        });
      }else{
        console.log("USER ALREADY EXISTS")
      }
    })
  }
}

app.get('/users',(req,res) => {
  res.set('Content-Type','application/json');

  pool.query("SELECT * FROM users",(err,result,fields) => {
    if(!err){
      res.json(result);
      res.end();
    }
  });
});

app.get('/user/:id/friends',(req,res) => {
  res.set('Content-Type','application/json')

  pool.query("select users.email,users.username from friends inner join users on friends.friend_id=users._id where friends.user_id="+req.params.id,(err,result,fields) => {
    if(!err){
      res.json({
        PAYLOAD:result,
        TYPE:"SUCCESS",
        MESSAGE:"RETRIEVED FRIENDS"
      })
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"FAILED TO RETRIEVE FRIENDS"
      })
    }
    res.end();
  })
})

app.get('/user/:id/requests',(req,res) => {
  res.set('Content-Type','application/json')

  pool.query("select users.username,users._id,friend_requests.accepted from friend_requests inner join users on friend_requests.sender_id=users._id where friend_requests.reciever_id="+req.params.id+" AND accepted=0",(err,result,fields) => {
    if(!err){
      res.json({
        PAYLOAD:result,
        TYPE:"SUCCESS",
        MESSAGE:"RETRIEVED REQUESTS"
      })
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"FAILED TO RETRIEVE REQUESTS"
      })
    }
    res.end();
  })
})

app.post('/user/friend/accept',(req,res) => {
  res.set('Content-Type','application/json')

  pool.query("UPDATE friend_requests SET accepted=1 WHERE _id="+req.body.acceptedId,(err,response,fields) => {
    if(!err){
      AddToFriends(req.body.user_id,req.body.friend_id, () => {
        AddToFriends(req.body.friend_id,req.body.user_id,() => {
          res.json({
            TYPE:"SUCCESS",
            MESSAGE:"FRIEND REQUEST ACCEPTED"
          })
          res.end()
        })
      })
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"FAILED TO ACCEPT REQUEST"
      })
      res.end();
    }
  })
})

app.post('/user/friend/add',(req,res) => {
  res.set('Content-Type','application/json')
  pool.query("INSERT INTO friend_requests(sender_id,reciever_id) VALUES("+req.body.sender+","+req.body.reciever+")",(err,result,fields) => {
    if(!err){
      res.json({
        TYPE:"SUCCESS",
        MESSAGE:"FRIEND REQUEST ADDED"
      })
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"FAILED TO ADD FRIEND REQUEST"
      })
    }

    res.end()
  })
})

app.get('/user/:id',(req,res) => {
  res.set('Content-Type','application/json');

  pool.query("SELECT username,email FROM users WHERE _id='"+req.params.id+"'",(err,result,fields) => {
    if(!err){
      res.json(result);
      res.end();
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"ERROR FINDING USER WITH GIVEN ID"
      })
    }
  });
});

app.post('/user/login',(req,res) => {
  res.set('Content-Type','application/json');

  pool.query("SELECT _id,username FROM users WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'",(err,result,fields) => {
    if(!err){
      if(result.length == 1){
        res.json({
          PAYLOAD:result[0],
          TYPE:"SUCCESS",
          MESSAGE:"LOGGED IN"
        });
      }else{
        res.json({
          TYPE:"FAILURE",
          MESSAGE:"INCORRECT USERNAME OR PASSWORD"
        });
      }
    }

    res.end();
  });
});

app.post('/users/find',(req,res) => {
  res.set('Content-Type','application/json');
  pool.query("SELECT _id,username,email FROM users WHERE username LIKE '%"+req.body.searchTerm+"%'",(err,result,fields) => {
    if(!err){
      res.json(result);
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"UNABLE TO FIND RESULTS"
      })
    }

    res.end();
  });
});

app.get('/user/:id/shares',(req,res) => {
  res.set('Content-Type','application/json');
  res.json({message:"Getting Shares from: "+req.params.id});
  res.end();
});

app.post('/user/create',(req,res) => {
  res.set('Content-Type','application/json');
  console.log(req.body);
  CheckUserExists(req.body.username,req.body.email,req.body.password,(result) => {
    res.json(result);
    res.end();
  });
});

app.get('/users/:id/stream',(req,res) => {
  res.set('Content-Type','application/json');
  pool.query("select users.username,shared.title,shared.artist from shared inner join friends on shared.sharer=friends.friend_id inner join users on users._id=friends.friend_id where friends.user_id="+req.params.id,(err,result,fields) => {
    if(!err){
      res.json({
        PAYLOAD:result,
        TYPE:"SUCCESS",
        MESSAGE:"FETCHED STREAM"
      })
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"FAILED TO FETCH SHARES"
      })
    }

    res.end();
  })
});

app.get('/share/:id',(req,res) => {
  res.set('Content-Type','application/json');
  pool.query('INSERT INTO users(username,password,email) VALUES("'+req.body.username+'","'+req.body.password+'","'+req.body.email+'")',(err,result,fields) => {
    if(!err){
      res.json({MESSAGE:"USER CREATED"});
      res.end();
    }
  })
});

app.post('/share/create',(req,res) => {
  res.set('Content-Type','application/json');

  pool.query("INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','')",(err,result,fields) => {
    if(!err){
      res.json({
        TYPE:"SUCCESS",
        MESSAGE:"SHARED SUCCESFUL"
      });
    }else{
      res.json({
        TYPE:"ERROR",
        MESSAGE:"ERROR SHARING MEDIA"
      })
    }

    res.end();
  })
});

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
