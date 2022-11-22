import { appInitState } from '~/storeRedux/app/reducer';
import { modalInitState } from '~/storeRedux/modal/reducer';
import { authInitState } from '~/storeRedux/auth/reducer';
import { postInitState } from '~/storeRedux/post/reducer';
import { groupInitState } from '~/storeRedux/groups/reducer';
import { homeInitState } from '~/storeRedux/home/reducer';
import { menuInitState } from '~/storeRedux/menu/reducer';
import { noInternetInitState } from '~/storeRedux/network/reducer';

const initialState = {
  app: appInitState,
  modal: modalInitState,
  auth: authInitState,
  post: postInitState,
  groups: groupInitState,
  home: homeInitState,
  menu: menuInitState,
  noInternet: noInternetInitState,
};

export default initialState;
