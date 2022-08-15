import { appInitState } from '~/storeRedux/app/reducer';
import { modalInitState } from '~/storeRedux/modal/reducer';
import { authInitState } from '~/storeRedux/auth/reducer';
import { postInitState } from '~/storeRedux/post/reducer';
import { groupInitState } from '~/storeRedux/groups/reducer';
import { homeInitState } from '~/storeRedux/home/reducer';
import { notiInitState } from '~/storeRedux/notification/reducer';
import { menuInitState } from '~/storeRedux/menu/reducer';
import { noInternetInitState } from '~/storeRedux/network/reducer';
import { mentionInputInitState } from '~/beinComponents/inputs/MentionInput/redux/reducer';
import { giphyInitState } from './giphy/reducer';

const initialState = {
  app: appInitState,
  modal: modalInitState,
  auth: authInitState,
  post: postInitState,
  groups: groupInitState,
  home: homeInitState,
  notifications: notiInitState,
  menu: menuInitState,
  noInternet: noInternetInitState,
  mentionInput: mentionInputInitState,
  giphy: giphyInitState,
};

export default initialState;
