const admin = require("firebase-admin");
const dotenv = require("dotenv").config();
const serviceAccount = require("../servicesAccountKey.json");

/**
 * Connect to Firebase.
 *
 * This utility function initializes the Firebase Admin SDK using a service account key.
 * It connects to the Firebase Realtime Database with the provided URL. A log message
 * is printed once the connection is established.
 */
const fireBaseConnection = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://kisahdemo-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
  console.log("Connected to Firebase");
};

/**
 * Send a push notification using Firebase Cloud Messaging.
 *
 * This function sends a push notification to a specific device using Firebase Cloud
 * Messaging (FCM). The notification contains a title and body, and is sent to the
 * device identified by the provided `deviceToken`.
 *
 * @param {string} deviceToken - The device token of the recipient.
 * @param {string} messageBody - The body of the notification message.
 */
async function sendPushNotification(deviceToken, messageBody) {
  const message = {
    notification: {
      title: "Your Notification Title",
      body: messageBody,
    },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = { fireBaseConnection, sendPushNotification };
