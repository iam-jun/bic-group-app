import { appInitState } from '~/storeRedux/app/reducer';
import { modalInitState } from '~/storeRedux/modal/reducer';
import { postInitState } from '~/storeRedux/post/reducer';
import { groupInitState } from '~/storeRedux/groups/reducer';
import { menuInitState } from '~/storeRedux/menu/reducer';

const initialState = {
  app: appInitState,
  modal: modalInitState,
  post: postInitState,
  groups: groupInitState,
  menu: menuInitState,
};

export default initialState;
