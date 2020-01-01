const bcrypt = require('bcrypt');
var Utils = require('../utils/Utils.js');

function UserController(DatabaseConnection,ExpressApp){
	this.connection = DatabaseConnection;
	this.app = ExpressApp;
	this.utils = new Utils(this.connection);

		//Sets the given user's notification token.
		this.app.post('/notification', async (req,res) => {
			console.log('working')
			res.set('Content-Type','application/json');

			await this.utils.CheckCredentials(req).then((result) => {
				console.log(req.body)
				this.connection.query(`UPDATE users SET notif_token='${req.body.token}' WHERE _id=${req.body.id}`,(err,result) => {
					if(!err) {
						res.json({
							STATUS: "SUCCESS",
							MESSAGE: "ADDED NOTIFICATION TOKEN"
						});
						res.end();
					} else {
						res.json({
							STATUS: "ERROR",
							MESSAGE: "ERROR ADDING TOKEN"
						});
						res.end();
					}
				});
			});
		});
}

module.exports = UserController;
