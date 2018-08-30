function FavoritesController(DatabaseConnection,ExpressApplication){
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;

    this.app.post('/shares/like',(req,res) => {
      res.set('Content-Type','applicaton/json')

      this.connection.query("insert into shared_likes(track_id,liker_id) values("+req.body.track_id+","+req.body.liker_id+")",(err,result,fields) => {
          if(!err){
            res.json({
              TYPE:"SUCCESS",
              MESSGE:"SUCCESFULLY LIKED TRACK"
            })
          }else{
            res.json({
              TYPE:"ERROR",
              MESSAGE:"FAILED TO LIKE TRACK"
            })
          }
      })
    })
}

module.exports = FavoritesController;