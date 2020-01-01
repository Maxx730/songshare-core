const { Expo } = require('expo-server-sdk');

function NotificationManager(){
  this.expo = new Expo();
}

NotificationManager.prototype.Notify = function(token){
  let chunks = this.expo.chunkPushNotifications([
    {
      to: token,
      sound: 'default',
      body: 'This is a test notification'
    }
  ]);

  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

module.exports = NotificationManager;
