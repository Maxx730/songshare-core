let NotificationManager = require('../lib/NotificationManager');

function NotificationController(ExpressApplication){
    console.log("Initializing Notification Controller...");
    this.notification = new NotificationManager();

    this.app = ExpressApplication;

    this.app.post('/notify',(req,res) => {
        res.set('Content-Type','application/json');

        this.notification.Notify(req.body.title,req.body.message);

        res.json({
            TYPE:"SUCCESS",
            MESSAGE:"SEND NOTIFICATION"
        })

        res.end();
    })
}

module.exports = NotificationController;