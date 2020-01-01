const bcrypt = require('bcrypt');
var Utils = require('../utils/Utils.js');

function UserController(DatabaseConnection,ExpressApp){
	this.connection = DatabaseConnection;
	this.app = ExpressApp;
	this.utils = new Utils(this.connection);

		//Sets the given user's notification token.
		this.app.post('/notification', async (req,res) => {
			console.log('working')

			console.log(req)
		});
}

module.exports = UserController;
