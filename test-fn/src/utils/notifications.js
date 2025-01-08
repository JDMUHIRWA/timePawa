export const setupNotifications = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const sendNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "test-fn/public/Frame 143.svg", // Optional: add your app's icon
    });
  }
};
