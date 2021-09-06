import messaging from '@react-native-firebase/messaging';

const initPushTokenMessage = async (): Promise<any> => {
  return messaging;
};

export {initPushTokenMessage};
