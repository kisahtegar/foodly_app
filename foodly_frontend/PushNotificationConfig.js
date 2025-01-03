import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";
import { navigate } from "./RootNavigation";

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: async function (notification) {
    console.log("Notification received:", notification);

    if (notification.userInteraction) {
      console.log("Notification data:", notification.data);

      if (notification.data && notification.data.orderId) {
        //    const { data: order, error } = await fetchOrderDetailsById(notification.data.orderId);

        if (order) {
          navigate("order-details", order.data);
        } else if (error) {
          console.error("Error fetching order details:", error);
        }
      }
    }

    notification.finish(PushNotification.FetchResult.NoData);
  },

  senderID: "YOUR_SENDER_ID",

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

export const createNotificationChannel = () => {
  if (Platform.OS === "android") {
    PushNotification.createChannel(
      {
        channelId: "13761849010",
        channelName: "Default Channel",
        channelDescription: "A default channel",
        playSound: true,
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }
};
