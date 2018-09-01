var request = require('request');

function NotificationError(type,message){
    this.type = type;
    this.message = message;
}

function NotificationManager(){

}

NotificationManager.prototype.Notify = function(type,title,description){
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
            "title":title,
            "body":description
          }
        },
    },function (error, response, body) {
          if (!error && response.statusCode == 200) {
            return new NotificationError("ERROR","UNABLE TO SEND NOTIFICATION");
          }
      }
  );
}

module.exports = NotificationManager;