import messaging from '@react-native-firebase/messaging';

import * as IAuth from '~/interfaces/IAuth';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {rootSwitch} from '~/router/stack';
import {makePushTokenRequest} from '~/services/httpApiRequest';
import Store from '~/store';

const navigation = withNavigation(rootNavigationRef);

function* checkAuthState() {
  try {
    // const httpResponse = yield makeHttpRequest(
    //   apiConfig.Chat.getDirectMessages(),
    // );
    // console.log('httpResponse raw', httpResponse.data);
    // if (httpResponse) {
    //   console.log('httpResponse:', mapResponseSuccessBein(httpResponse));
    // }
    const user: IAuth.IUserResponse | boolean = yield Store.getCurrentUser();
    if (user) {
      yield setupPushToken();
      navigation.replace(rootSwitch.mainStack);
    } else {
      navigation.replace(rootSwitch.authStack);
    }
  } catch (e) {
    console.error('checkAuthState', e);
  }
}

function* setupPushToken() {
  try {
    // Get Firebase token
    const deviceToken = yield messaging().getToken();
    // Push token firebase
    const r = yield makePushTokenRequest(deviceToken);
    console.log('rererererer:', r); // TODO: remove
  } catch (e) {
    console.log('setupPushToken fail:', e);
  }
}

export {checkAuthState, setupPushToken};
