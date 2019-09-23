const bcrypt = require('bcrypt');

function UserController(DatabaseConnection,ExpressApp){
    this.connection = DatabaseConnection;
    this.app = ExpressApp;

    this.app.get('/users',(req,res) => {
      res.set('Content-Type','application/json');

      this.connection.query("SELECT * FROM users",(err,result,fields) => {
        if(!err){
          res.json(result);
          res.end();
        }
      });
    });

    this.app.get('/user/:id/friends',(req,res) => {
        res.set('Content-Type','application/json')

        this.connection.query("SELECT * FROM friends INNER JOIN users senders ON friends.sender=senders._id INNER JOIN users receivers ON friends.receiver=friends._id WHERE friends.sender="+req.params.id + " OR friends.receiver=" + req.params.id,(err,result,fields) => {
          if(!err){
            res.json({
              PAYLOAD:result,
              TYPE:"SUCCESS",
              MESSAGE:"RETRIEVED FRIENDS"
            })
          }else{
			  console.log(err)
            res.json({
              TYPE:"ERROR",
              MESSAGE:"FAILED TO RETRIEVE FRIENDS"
            })
          }
          res.end();
        })
    })

    this.app.get('/user/:id/requests',(req,res) => {
      res.set('Content-Type','application/json')

      this.connection.query("select friend_requests._id as request_id,users.username,users._id,friend_requests.accepted from friend_requests inner join users on friend_requests.sender_id=users._id where friend_requests.reciever_id="+req.params.id+" AND accepted=0",(err,result,fields) => {
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

    this.app.post('/user/friend/accept',(req,res) => {
      res.set('Content-Type','application/json')

      this.connection.query("UPDATE friend_requests SET accepted=1 WHERE _id="+req.body.acceptedId,(err,response,fields) => {
        if(!err){
          AddToFriends(req.body.user_id,req.body.friend_id, () => {
            AddToFriends(req.body.friend_id,req.body.user_id,() => {
              res.json({
                PAYLOAD:result,
                TYPE:"SUCCESS",
                MESSAGE:"FRIEND REQUEST ACCEPTED"
              })
              res.end()
            })
          })
        }else{
          res.json({
            TYPE:"ERROR",
            CONTEXT:"UPDATING TO ACCEPTED",
            MESSAGE:"FAILED TO ACCEPT REQUEST"
          })
          res.end();
        }
      })
    })

    this.app.post('/user/friend/add',(req,res) => {
      res.set('Content-Type','application/json')
      this.connection.query("INSERT INTO friend_requests(sender_id,reciever_id) VALUES("+req.body.sender+","+req.body.reciever+")",(err,result,fields) => {
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

    this.app.post('/user/friends/check',(req,res) => {
      res.set('Content-Type','application/json')

      this.connection.query("SELECT * FROM friends WHERE friend_id="+req.body.friend_id+" AND user_id="+req.body.user_id,(err,result,fields) => {
        if(!err){
          if(result.length > 0){
            res.json({
              TYPE:"TRUE",
              MESSAGE:"USERS ARE FRIENDS"
            })
          }else{
            res.json({
              TYPE:"FALSE",
              MESSAGE:"USERS ARE NOT FRIENDS"
            })
          }
        }else{
          res.json({
            TYPE:"ERROR",
            MESSAGE:"FAILED TO CHECK IF USERS WERE FRIENDS"
          })
        }
      })
    })

    this.app.get('/user/:id',(req,res) => {
      res.set('Content-Type','application/json');

      this.connection.query("SELECT username,email,joined FROM users WHERE _id='"+req.params.id+"'",(err,result,fields) => {
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

    this.app.post('/user/create',(req,res) => {
	  res.set('Content-Type','application/json');
	  
	  let username = req.body.username;
	  let email = req.body.email;
	  let password = req.body.password;

	  if(typeof username != "undefined" && username != "" && typeof email != "undefined" && email != ""){
		this.connection.query("SELECT * FROM users WHERE username='"+username+"'",(err,result,fields) => {
		  if(result.length == 0 && !err){
			this.connection.query("SELECT * FROM users WHERE email='"+email+"'",(err,results,fields) => {
			  if(results.length == 0 && !err){
				this.connection.query('INSERT INTO users(username,password,email) VALUES("'+username+'","'+password+'","'+email+'")',(err,result,fields) => {
				  if(!err){
					console.log("USER CREATED")
					res.json(
					  {
						PAYLOAD:result,
						STATUS:"SUCCESS",
						MESSAGE:"USER CREATED"
					  }
					);
					res.end();
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
    });

    this.app.post('/user/login',async (req,res) => {
	  res.set('Content-Type','application/json');
	  
	  this.connection.query("SELECT _id,username,password FROM users WHERE username='" + req.body.username + "'",(err,result) => {
		  if(!err) {
			bcrypt.compare(req.body.password,result[0].password,(err,bres) => {
				if(!err){
					if(bres){
						res.json({
							PAYLOAD:{
								_id: result[0]._id,
								username: result[0].username
							},
							TYPE:"SUCCESS",
							MESSAGE:"LOGGED IN"
						});
					}else{
						res.json({
							TYPE:"FAILURE",
							MESSAGE:"INCORRECT USERNAME OR PASSWORD"
						});
					}
				} else {
					console.log(err);
				}
			})
		
		  } else {
			  console.log(err);
		  }
	  });
    });

    this.app.post('/users/find',(req,res) => {
      res.set('Content-Type','application/json');
      if(req.body.searchTerm == "" || req.body.searchTerm == " "){
        res.end();
      }else{
            this.connection.query("SELECT _id,username,email FROM users WHERE username LIKE '%"+req.body.searchTerm+"%'",(err,result,fields) => {
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
        }
    });
}

module.exports = UserController;