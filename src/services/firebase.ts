/* eslint-disable no-console */
import messaging from '@react-native-firebase/messaging';

export const initPushTokenMessage = async (): Promise<any> => messaging;

export async function deleteTokenMessage() {
  try {
    await messaging().deleteToken();
  } catch (error) {
    console.error('\x1b[35m🐣️ firebase deleteTokenMessage ', error, '\x1b[0m');
  }
}

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
    || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log(
      'Authorization status:', authStatus,
    );
  }
}

export async function initFirebaseMessaging() {
  try {
    await requestUserPermission();
  } catch (e) {
    console.log(
      'setupFirebaseHandler failed:', e,
    );
  }
}
