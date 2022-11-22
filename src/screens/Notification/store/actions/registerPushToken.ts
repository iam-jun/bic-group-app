import { makePushTokenRequest } from '~/api/apiRequest';
import { initPushTokenMessage } from '~/services/firebase';
import INotificationsState from '../Interface';

const registerPushToken = (set, get) => async (payload?: any) => {
  try {
    const data: INotificationsState = get();

    const savedToken = data?.pushToken;

    const messaging: any = await initPushTokenMessage();
    const newToken: string = payload?.token || (await messaging().getToken());

    if (!!savedToken && newToken === savedToken) {
      // if current token same as new token, just skip
      return;
    }

    // when initPushTokenMessage, onTokenRefresh will be called
    // save token first to avoid call backend multiple times
    set((state: INotificationsState) => {
      state.pushToken = newToken;
    }, 'setPushTokenSuccess');
    await makePushTokenRequest(newToken);
  } catch (e) {
    set((state: INotificationsState) => {
      state.pushToken = '';
    }, 'setPushTokenFailed');
    console.error(
      'register push token failed', e,
    );
  }
};

export default registerPushToken;
