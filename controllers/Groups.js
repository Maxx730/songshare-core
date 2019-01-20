var request = require('request');

function GroupController(DatabaseConnection,ExpressApplication){
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;

    this.app.get('/groups',(req,res) => {
        res.set('Content-Type','application/json');

        this.connection.query('select * from groups',(err,result,fields) => {
            if(!err){
                res.json({
                    PAYLOAD:result,
                    MESSAGE:"SUCCESFULLY PULLED GROUPS",
                    TYPE:"SUCCESS"
                })
            }else{
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO PULL GROUPS"
                })
            }

            res.end();
        });
    });

    this.app.get('/group/:id',(req,res) => {
        res.set('Content-Type','application/json');

        this.connection.query('select * from groups where id='+req.params.id,(err,result,fields) => {
            if(!err){
                res.json({
                    PAYLOAD:result,
                    MESSAGE:"SUCCESFULLY PULLED GROUP",
                    TYPE:"SUCCESS"
                })
            }else{
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO PULL GROUP"
                })
            }

            res.end();
        });
    });

    this.app.post('/group/create',(req,res) => {
        res.set('Content-Type','application/json');

        this.connection.query("insert into groups(creator,title,description) values("+req.body.creator+",'"+req.body.title+"','"+req.body.description+"')",(err,result,fields) => {
            if(!err){
                res.json({
                    PAYLOAD:result,
                    MESSAGE:"SUCCESFULLY CREATED GROUP",
                    TYPE:"SUCCESS"
                })
            }else{
                console.log(err)
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO CREATE GROUP"
                })
            }

            res.end();
        });
    });

    this.app.post('/group/share',(req,res) => {
        res.set('Content-Type','application/json');

        if(req.body.art != null && typeof req.body.art != "undefined"){
          if(req.body.spotify_id != null && typeof req.body.spotify_id != "undefined"){
            query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,art,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'"+req.body.spotify_id+"','','','"+req.body.art+"',"+req.body.group_id+")";
          }else if(req.body.youtube_id != null && typeof req.body.youtube_id != "undefined"){
            query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,art,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','"+req.body.youtube_id+"','"+req.body.art+"',"+req.body.group_id+")";
          }else{
            query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,art,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','','"+req.body.art+"',"+req.body.group_id+")";
          }
        }else{
          query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','',"+req.body.group_id+")";
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
            res.json({
              ERROR:err,
              TYPE:"ERROR",
              MESSAGE:"ERROR SHARING MEDIA"
            })
          }
  
          res.end();
        })
    });

    this.app.post('/group/friend/send',(req,res) => {
        res.set('Content-Type','application/json');

        if(req.body.sender_id != req.body.reciever_id){
            this.connection.query("insert into group_friends(sender_id,reciever_id,group_id) values('"+req.body.sender_id+"','"+req.body.reciever_id+"','"+req.body.group_id+"')",(err,result,fields) => {
                if(!err){
                    //Here we are also going to want to send a notification to an invite into a group.
                    res.json({
                        TYPE:"SUCCESS",
                        MESSAGE:"SUCCESFULLY CREATED GROUP INVITE"
                    })
                }else{
                    res.json({
                        TYPE:"FAILED",
                        MESSAGE:"FAILED TO CREATE GROUP INVITE"
                    })
                }
            })
            res.end();
        }else{
            res.json({
                TYPE:"ERROR",
                MESSAGE:"SENDER AND RECIEVER ID ARE THE SAME"
            })
            res.end();
        }
    });

    this.app.post('/group/friend/accept',(req,res) => {
        res.set('Content-Type','application/json')

        this.connection.query('update table',(err,result,fields) => {
            if(!err){
                res.json({
                    TYPE:"SUCCESS",
                    MESSAGE:"ACCEPTED GROUP REQUEST"
                })
            }else{
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO ACCEPT GROUP REQUEST"
                })
            }

            res.end()
        })
    })
}

module.exports = GroupController;

var request = require('request');

function GroupController(DatabaseConnection,ExpressApplication){
    this.connection = DatabaseConnection;
    this.app = ExpressApplication;

    this.app.get('/groups',(req,res) => {
        res.set('Content-Type','application/json');

        this.connection.query('select * from groups',(err,result,fields) => {
            if(!err){
                res.json({
                    PAYLOAD:result,
                    MESSAGE:"SUCCESFULLY PULLED GROUPS",
                    TYPE:"SUCCESS"
                })
            }else{
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO PULL GROUPS"
                })
            }

            res.end();
        });
    });

    this.app.get('/group/:id',(req,res) => {
        res.set('Content-Type','application/json');

        this.connection.query('select * from groups where id='+req.params.id,(err,result,fields) => {
            if(!err){
                res.json({
                    PAYLOAD:result,
                    MESSAGE:"SUCCESFULLY PULLED GROUP",
                    TYPE:"SUCCESS"
                })
            }else{
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO PULL GROUP"
                })
            }

            res.end();
        });
    });

    this.app.post('/group/create',(req,res) => {
        res.set('Content-Type','application/json');

        this.connection.query("insert into groups(creator,title,description) values("+req.body.creator+",'"+req.body.title+"','"+req.body.description+"')",(err,result,fields) => {
            if(!err){
                res.json({
                    PAYLOAD:result,
                    MESSAGE:"SUCCESFULLY CREATED GROUP",
                    TYPE:"SUCCESS"
                })
            }else{
                console.log(err)
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO CREATE GROUP"
                })
            }

            res.end();
        });
    });

    this.app.post('/group/share',(req,res) => {
        res.set('Content-Type','application/json');

        if(req.body.art != null && typeof req.body.art != "undefined"){
          if(req.body.spotify_id != null && typeof req.body.spotify_id != "undefined"){
            query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,art,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'"+req.body.spotify_id+"','','','"+req.body.art+"',"+req.body.group_id+")";
          }else if(req.body.youtube_id != null && typeof req.body.youtube_id != "undefined"){
            query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,art,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','"+req.body.youtube_id+"','"+req.body.art+"',"+req.body.group_id+")";
          }else{
            query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,art,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','','"+req.body.art+"',"+req.body.group_id+")";
          }
        }else{
          query = "INSERT INTO shared(sharer,title,artist,duration,spotify_id,google_play_id,youtube_id,group_id) VALUES("+req.body._id+",'"+req.body.title+"','"+req.body.artist+"',0,'','','',"+req.body.group_id+")";
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
            res.json({
              ERROR:err,
              TYPE:"ERROR",
              MESSAGE:"ERROR SHARING MEDIA"
            })
          }
  
          res.end();
        })
    });

    this.app.post('/group/friend/send',(req,res) => {
        res.set('Content-Type','application/json');

        if(req.body.sender_id != req.body.reciever_id){
            this.connection.query("insert into group_friends(sender_id,reciever_id,group_id) values('"+req.body.sender_id+"','"+req.body.reciever_id+"','"+req.body.group_id+"')",(err,result,fields) => {
                if(!err){
                    //Here we are also going to want to send a notification to an invite into a group.
                    res.json({
                        TYPE:"SUCCESS",
                        MESSAGE:"SUCCESFULLY CREATED GROUP INVITE"
                    })
                }else{
                    res.json({
                        TYPE:"FAILED",
                        MESSAGE:"FAILED TO CREATE GROUP INVITE"
                    })
                }
            })
            res.end();
        }else{
            res.json({
                TYPE:"ERROR",
                MESSAGE:"SENDER AND RECIEVER ID ARE THE SAME"
            })
            res.end();
        }
    });

    this.app.post('/group/friend/accept',(req,res) => {
        res.set('Content-Type','application/json')

        this.connection.query('update table',(err,result,fields) => {
            if(!err){
                res.json({
                    TYPE:"SUCCESS",
                    MESSAGE:"ACCEPTED GROUP REQUEST"
                })
            }else{
                res.json({
                    TYPE:"ERROR",
                    MESSAGE:"FAILED TO ACCEPT GROUP REQUEST"
                })
            }

            res.end()
        })
    })
}

module.exports = GroupController;

