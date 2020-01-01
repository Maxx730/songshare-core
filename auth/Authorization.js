
var basicAuth = require('express-basic-auth');
var bcrypt = require('bcrypt');

function Authorization(Database,Application) {
    console.log("INITIALIZING AUTHORIZATION");
    this.connection = Database;
    this.app = Application;

    //Anytime any connection is made to the backend database,
    //authorize that this user exists within the database.

}

module.exports = Authorization;
