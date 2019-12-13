
var basicAuth = require('express-basic-auth');
var bcrypt = require('bcrypt');

function Authorization(Database,Application) {
    console.log("INITIALIZING AUTHORIZATION");
    this.connection = Database;
    this.app = Application;

    //Anytime any connection is made to the backend database,
    //authorize that this user exists within the database.
    this.app.use(basicAuth({
        authorizer: (username,password) => {
            console.log("AUTHORIZING...");
            //Check the database for a user with the given password.
            return true;
        },
        unauthorizedResponse: (req) => {
            console.log(req.headers)
            console.log(req.authorization)
            return "Authorization Credentials Required";
        }
    }));
}

module.exports = Authorization;
