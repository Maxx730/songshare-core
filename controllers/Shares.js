var request = require('request');

function SharesController(DatabaseConnection,ExpressApplication){
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;

    this.app.get('/share/:id',(req,res) => {
      res.set('Content-Type','application/json');
      this.connection.query("select * from shared WHERE sharer=" + req.params.id,(err,result,fields) => {
        if(!err && result.length > 0){
          res.json({
            PAYLOAD:result,
            TYPE:"SUCCESS",
            MESSAGE:"SUCCESFULLY PULL SHARED INFORMATION"
          })
          res.end();
        }else{
          res.json({
            ERROR:err,
            TYPE:"ERROR",
            MESSAGE:"ERROR PULLING INFO FOR SHARED ID"
          })
          res.end()
        }
      })
    });

    this.app.post('/share/create',(req,res) => {
      res.set('Content-Type','application/json');

      if(req.body.art != null && typeof req.body.art != "undefined"){
        if(req.body.spotify_id != null && typeof req.body.spotify_id != "undefined"){
          query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,play_id,youtube_id,art) VALUES("+req.body._id+",'"+req.body.title.replace(/'/g,"")+"','"+req.body.artist+"',0,'"+req.body.spotify_id+"','','','"+req.body.art+"')";
        }else if(req.body.youtube_id != null && typeof req.body.youtube_id != "undefined"){
          query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,play_id,youtube_id,art) VALUES("+req.body._id+",'"+req.body.title.replace(/'/g,"")+"','"+req.body.artist+"',0,'','','"+req.body.youtube_id+"','"+req.body.art+"')";
        }else{
          query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,play_id,youtube_id,art) VALUES("+req.body._id+",'"+req.body.title.replace(/'/g,"")+"','"+req.body.artist+"',0,'','','','"+req.body.art+"')";
        }
      }else{
        query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,play_id,youtube_id) VALUES("+req.body._id+",'"+req.body.title.replace(/'/g,"")+"','"+req.body.artist+"',0,'','','')";
      }

      this.connection.query(query,(err,result,fields) => {
        if(!err){
          //Send our Firebase notification before sending back the successful response.
          request({
              url: "https://fcm.googleapis.com/fcm/send",
              method: "POST",
              json: true,
              headers: {"Content-Type": "application/json",
              'Authorization':'key=AAAAitUVliE:APA91bHfJg19h6PdsgU8tXkiMgUbr902EoxwZdllnq_iCVCgNjc4HxiEW1ke6xrepWdISeKZriw8jBUT7CPHp0OUmP-iQAfslnUuF6XJtGC2WxkwXggKG4HHNHZnX7FLl1tG9l1Px1hz'
              },
              body: {
                "to":"/topics/all",
                "content_available":true,
                "notification":{
                  "title":req.body.username+" shared a Track!",
                  "body":req.body.title+" by "+req.body.artist
                }
              },
          },function (error, response, body) {
                if (!error && response.statusCode == 200) {

                }
            }
        );

        res.json({
          TYPE:"SUCCESS",
          MESSAGE:"SHARED SUCCESFUL"
        });
        }else{
          console.log(err)
          res.json({
            ERROR:err,
            TYPE:"ERROR",
            MESSAGE:"ERROR SHARING MEDIA"
          })
        }

        res.end();
      })
    });

    this.app.get('/user/:id/shares',(req,res) => {
      res.set('Content-Type','application/json');

      let query = "select shared._id,shared.title,shared.artist,users.username,shared.time_shared,shared.art,shared.spotify_id,shared.youtube_id from shared inner join users on shared.sharer=users._id inner join friends on friends.friend_id=users._id where (friends.user_id="+req.params.id+" and shared.youtube_id='') or (shared.sharer="+req.params.id+" and shared.youtube_id='') group by(shared._id) order by(shared.time_shared) desc";

      this.connection.query(query,(err,result,fields) => {
        if(!err){
          res.json({
            PAYLOAD:result,
            TYPE:"SUCCESS",
            MESSAGE:"PULLED USER SHARE STREAM"
          })
          res.end()
        }else{
          res.json({
            TYPE:"ERROR",
            MESSAGE:"ERROR PULLING USER SHARE STREAM"
          })
          res.end()
        }
      })
    });
}

module.exports = SharesController;