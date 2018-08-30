function ProfileController(DatabaseConnection,ExpressApplication){
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;

    this.app.post('/user/update/image',(req,res) => {
      res.set('Content-Type','application/json');

      query = "UPDATE users SET profile='"+req.body.profile+"' WHERE _id="+req.body.user_id;

      this.connection.query(query,(err,result,fields) => {
        if(!err){
          res.json({
            TYPE:"SUCCESS",
            MESSAGE:"USER PROFILE IMAGE CHANGED"
          })
        }else{
          res.json({
            TYPE:"ERROR",
            MESSAGE:"ERROR UPDATED USER PROFILE IMAGE"
          })
        }
        res.end()
      })
    });

    this.app.post('/user/update/email',(req,res) => {
        res.set('Content-Type','application/json');
        res.json({
            "MESSAGE":"UPDATING EMAIL"
        })
        res.end();
    })
}

module.exports = ProfileController;