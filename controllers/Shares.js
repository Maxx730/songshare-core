var request = require('request');
var Utils = require('../utils/Utils.js');

function SharesController(DatabaseConnection,ExpressApplication){
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;
    this.utils = new Utils(DatabaseConnection);

    this.app.get('/share/:id',(req,res) => {
      res.set('Content-Type','application/json');

      this.utils.CheckCredentials(req).then(result => {
        //Any user should be able to see details on any other share, they should not really be 
        //able to see share details unless they are following someone else.
        this.connection.query(`SELECT * FROM shared WHERE _id=${req.params.id}`,(err,result) => {
          if(!err) {
            res.send({
              TYPE: 'SUCCESS',
              MESSAGE: 'SHARE FOUND',
              PAYLOAD: result
            });
            res.end();
          } else {
            res.send({
              TYPE: 'ERROR',
              MESSAGE: 'ERROR FINDING SHARE'
            });
            res.end();
          }
        });
      }).catch(error => {
        res.send(error);
        res.end();
      });
    });

    this.app.post('/share/create',(req,res) => {
      res.set('Content-Type','application/json');
    });

    //Only the logged in user is allowed to see their shared stream.
    this.app.get('/user/:id/shares',(req,res) => {
      res.set('Content-Type','application/json');

      this.utils.CheckCredentials(req).then(result => {
        this.utils.CheckAuthorization(result,{
          TYPE: 'USER_SHARES',
          DATA: req.body
        }).then(result => {
          //Once we have been granted permission, we now make the query to the database.
          this.connection.query(``,(err,result) => {
            if(!err) {

            } else {

            }
          });
        }).catch(error => {
          res.send(error);
          res.end();
        });
      }).catch(error => {
        res.send(error);
        res.end();
      });
	});
}

module.exports = SharesController;