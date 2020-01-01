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
			  res.end();
			}
		});
		  }).catch(error => {
			  res.send(error);
			  res.end();
		  });
    });

	//Returns infomation about a user based on given id.
    this.app.get('/user/:id',async (req,res) => {
	  res.set('Content-Type','application/json');
	  //Check Credentials
	  await this.utils.CheckCredentials(req).then(result => {
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
			  });
			}
		  });
	  }).catch(error => {
		res.send(error);
		res.end();
	  });
	});

	//Endpoint for updating user profile based on JSON sent over.
	this.app.post('/user/:id/update',async (req,res) => {
		await this.utils.CheckCredentials(req).then(result => {
			this.utils.CheckAuthorization(result,{
				TYPE: 'UPDATE_USER',
				DATA: req.body
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

	//We dont need to check user credentials here because this is when the user is signing up.
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

		//Sets the given user's notification token.
		this.app.post('/user/notif_token', async (req,res) => {
			res.set('Content-Type','application/json');

			this.connection.query(`UPDATE user SET notif_token='${req.body.token}' WHERE _id=${req.body.id}`,(err,result) => {
				if(!err) {
					res.send({
						STATUS: "SUCCESS",
						MESSAGE: "ADDED NOTIFICATION TOKEN"
					});
					res.end();
				} else {
					res.send({
						STATUS: "ERROR",
						MESSAGE: "ERROR ADDING TOKEN"
					});
					res.end();
				}
			})
		});

	//If the user passes credentials here then thats all we need to sign up.
    this.app.post('/user/login',async (req,res) => {
		  res.set('Content-Type','application/json');

		  await this.utils.CheckCredentials(req).then(result => {
			//Send back the pertinent information that should be saved into the application, i.e do not send back the
			//password hash.
			res.send({
				_id: result._id,
				username: result.username,
				firstname: result.firstname,
				lastname: result.lastname,
				email: result.email
			});
			res.end();
		  }).catch(error => {
			  res.send(error);
			  res.end();
		  });

		  res.end();
    });

	//User needs to pass credentials to find other users to follow.
    this.app.post('/users/find',async (req,res) => {
		res.set('Content-Type','application/json');

		await this.utils.CheckCredentials(req).then(result => {
			//Make sure a username has been sent
			if(req.body.username) {
				this.connection.query(`SELECT _id,username,firstname,lastname FROM users WHERE username LIKE '%${req.body.username}%'`,(error,result) => {
					if(!error) {
						res.send({
							TYPE: 'SUCCESS',
							MESSAGE: 'QUERY FOR USERS SUCCESS',
							PAYLOAD: result
						});
						res.send();
					} else {
						console.log(error)
						res.send({
							TYPE: 'ERROR',
							MESSAGE: 'ERROR QUERYING FOR USER'
						});
						res.end();
					}
				});
			} else {
				res.send({
					TYPE: 'ERROR',
					MESSAGE: 'USERNAME PARAMETER MISSING'
				});
				res.end();
			}
		}).catch(error => {
			res.send(error);
			res.end();
		});
    });
}

module.exports = UserController;
