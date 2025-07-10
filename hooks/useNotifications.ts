// hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

interface UseNotificationsReturn {
  notification: Notifications.Notification | null;
  expoPushToken: string | null;
  error: string | null;
  requestPermission: () => Promise<boolean>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Request permission and get push token
    requestPermission();

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for user tapping on notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setError('Failed to get push token for push notification!');
        return false;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      return true;
    } catch (err) {
      setError('Error getting notification permissions');
      return false;
    }
  };

  return {
    notification,
    expoPushToken,
    error,
    requestPermission,
  };
}