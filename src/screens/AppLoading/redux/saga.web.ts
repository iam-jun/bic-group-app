import * as IAuth from '~/interfaces/IAuth';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {rootSwitch} from '~/router/stack';
import Store from '~/store';

const navigation = withNavigation(rootNavigationRef);

function* checkAuthState() {
  try {
    const user: IAuth.IUserResponse | boolean = yield Store.getCurrentUser();
    if (user) {
      navigation.replace(rootSwitch.mainStack);
    } else {
      navigation.replace(rootSwitch.authStack);
    }
  } catch (e) {
    console.error('checkAuthState error:', e);
  }
}

export {checkAuthState};
