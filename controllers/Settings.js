var Utils = require('../utils/Utils.js');

function SettingsController(DatabaseConnection,ExpressApp){
  this.connection = DatabaseConnection;
  this.app = ExpressApp;
  this.utils = new Utils(this.connection);

  this.app.get('/settings',async (req,res) => {
    await this.utils.CheckCredentials(req).then((result) => {
      //Check if the user has settings or not yet, if not create the default settings.
      this.connection.query(`SELECT defaultUserSearch,theme FROM settings WHERE user=${result._id}`,(err,results) => {
        if(!err) {
          if(results.length > 0){
            res.send({
              TYPE: 'SUCCESS',
              PAYLOAD: results,
              MESSAGE: 'SETTINGS RETRIEVED'
            });
            res.end();
          } else {
            this.connection.query(`INSERT INTO settings(user) VALUES(${result._id})`,(err,settings) => {
              if(!err) {
                this.connection.query(`SELECT defaultUserSearch,theme FROM settings WHERE user=${result._id}`,(err,payload) => {
                  res.send({
                    TYPE: 'SUCCESS',
                    PAYLOAD: payload,
                    MESSAGEL: 'CREATED SETTINGS'
                  });
                  res.end();
                })
              } else {
                res.send({
                  TYPE: 'ERROR',
                  MESSAGE: 'ERROR CREATING SETTINGS'
                });
                res.end();
              }
            });
          }
        } else {
          res.send({
            TYPE: 'ERROR',
            MESSAGE: 'ERROR RETRIEVING SETTINGS'
          });
          res.end();
        }
      });
    });
  });
}

module.exports = SettingsController;
