import { Expo } from 'expo-server-sdk';

function NotificationManager(){
  this.expo = new Expo();
}

NotificationManager.prototype.Notify = function(token){
  this.expo.chunkPushNotifications([
    {
      to: token,
      sound: 'default',
      body: 'This is a test notification'
    }
  ]);
}

module.exports = NotificationManager;
