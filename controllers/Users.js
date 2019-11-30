const bcrypt = require('bcrypt');
var Utils = require('../utils/Utils.js');

function UserController(DatabaseConnection,ExpressApp){
    this.connection = DatabaseConnection;
	this.app = ExpressApp;
	this.utils = new Utils(this.connection);

    this.app.get('/users',async (req,res) => {
	  res.set('Content-Type','application/json');
	
	  //Check Credentials
	 await this.utils.CheckCredentials(req).then((result) => {
		//If the credentials pass, then we are allowed to display the information.
		this.connection.query(`SELECT * FROM users`,(err,result,fields) => {
			if(!err){
			  res.json(result);
			  res.end();result
			}
		});
	  }).catch(error => {
		  res.send(error);
		  res.end();
	  })
    });

	//Returns infomation about a user based on given id.
    this.app.get('/user/:id',(req,res) => {
	  res.set('Content-Type','application/json');
	  //Check Credentials
	  this.utils.CheckCredentials(req).then(result => {
		this.connection.query("SELECT username,email,firstname,lastname,joined,profile FROM users WHERE _id='"+req.params.id+"'",(err,result,fields) => {
			if(!err){
				res.json({
					PAYLOAD:result,
					TYPE:"SUCCESS",
					MESSAGE:"USERS FOUND"
				});
				res.end();
			}else{
			  res.json({
				TYPE:"ERROR",
				MESSAGE:"ERROR FINDING USER WITH GIVEN ID"
			  })
			}
		  });
	  }).catch(error => {
		res.send(error);
		res.end();
	  });
	});
	
	//Endpoint for updating user profile based on JSON sent over.
	this.app.post('/user/:id/update',(req,res) => {
		this.utils.CheckCredentials(req).then(result => {
			console.log(req.body)
			this.utils.CheckAuthorization(req.body.user,{
				TYPE: 'UPDATE_USER',
				ACTOR: result
			}).then(result => {
				res.send(result);
				res.end();
			}).catch(error => {
				res.send(error);
				res.end();
			});
		}).catch(error => {
			res.send(error);
			res.end();
		});
	});

    this.app.post('/user/create', async (req,res) => {
	  res.set('Content-Type','application/json');
	  
	  let username = req.body.username;
	  let email = req.body.email;
	  let password = req.body.password;
	  const hashed = await bcrypt.hash(password, 10);

	  if(typeof username != "undefined" && username != "" && typeof email != "undefined" && email != ""){
		this.connection.query("SELECT * FROM users WHERE username='"+username+"'",(err,result,fields) => {
		  if(result.length == 0 && !err){
			this.connection.query("SELECT * FROM users WHERE email='"+email+"'",(err,results,fields) => {
			  if(results.length == 0 && !err){
				this.connection.query('INSERT INTO users(username,password,email) VALUES("'+username+'","'+hashed+'","'+email+'")',(err,result,fields) => {
				  if(!err){
					res.json(
					  {
						PAYLOAD:result,
						STATUS:"SUCCESS",
						MESSAGE:"USER CREATED"
					  }
					);
					res.end();
				  }else{
					res.json(
						{
						  STATUS:"ERROR",
						  MESSAGE:"ERROR CREATING USER"
						}
					);
					res.end();
				  }
				})
			  }else{
				res.json(
					{
					  STATUS:"ERROR",
					  MESSAGE:"ERROR CREATING USER"
					}
				);
				res.end();
			  }
			});
		  }else{
			res.json(
				{
				  STATUS:"ERROR",
				  MESSAGE:"USER ALREADY EXISTS"
				}
			);
			res.end();
		  }
		})
	  }
    });

	//Logs into 
    this.app.post('/user/login',async (req,res) => {
	  res.set('Content-Type','application/json');
	  
	  this.connection.query("SELECT _id,username,password FROM users WHERE username='" + req.body.username + "'",(err,result) => {
		  if(!err) {
			  if(result.length > 0) {
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
						res.json({
							TYPE:"ERROR",
							MESSAGE:"ERROR GETTING USER DATA"
						});
					}
				})
			  } else {
				res.json({
					TYPE:"ERROR",
					MESSAGE:"USER DOES NOT EXIST"
				});
			  }
		  } else {
			res.json({
				TYPE:"ERROR",
				MESSAGE:"ERROR CHECKING IF USER EXISTS"
			});  
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