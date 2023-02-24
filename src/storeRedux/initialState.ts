import { modalInitState } from '~/storeRedux/modal/reducer';
import { postInitState } from '~/storeRedux/post/reducer';
import { groupInitState } from '~/storeRedux/groups/reducer';

const initialState = {
  modal: modalInitState,
  post: postInitState,
  groups: groupInitState,
};

export default initialState;
