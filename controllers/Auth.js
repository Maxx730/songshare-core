const bcrypt = require('bcrypt');
var Utils = require('../utils/Utils.js');
var Secrets = require('../auth/Secrets.js');

function AuthController(DatabaseConnection,ExpressApplication){
    console.log('INITIALIZING AUTH ENDPOINT')
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;
    this.utils = new Utils(DatabaseConnection);

    //So when a user is new and needs to authorize Spotify to user our application, we need
    //to send back information about our application, this should only happen AFTER a user hash
    //created an account.
    this.app.get('/authorize',async (req,res) => {
      res.set('Content-Type','application/json');
      //Check user Credentials
      await this.utils.CheckCredentials(req).then((result) => {
        res.send(Secrets);
        res.end();
      }).catch(error => {
        res.send(error);
        res.end();
      });
    });
}

module.exports = AuthController;
