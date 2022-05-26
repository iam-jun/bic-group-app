import {appInitState} from '~/store/app/reducer';
import {modalInitState} from '~/store/modal/reducer';
import {authInitState} from '~/screens/Auth/redux/reducer';
import {postInitState} from '~/screens/Post/redux/reducer';
import {groupInitState} from '~/screens/Groups/redux/reducer';
import {homeInitState} from '~/screens/Home/redux/reducer';
import {notiInitState} from '~/screens/Notification/redux/reducer';
import {menuInitState} from '~/screens/Menu/redux/reducer';
import {noInternetInitState} from '~/screens/NoInternet/redux/reducer';
import {mentionInputInitState} from '~/beinComponents/inputs/MentionInput/redux/reducer';
import {initialChatState} from '~/store/chat/reducer';
import {giphyInitState} from './giphy/reducer';

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
  chat: initialChatState,
  giphy: giphyInitState,
};

export default initialState;
