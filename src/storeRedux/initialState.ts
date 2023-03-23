import { postInitState } from '~/storeRedux/post/reducer';
import { groupInitState } from '~/storeRedux/groups/reducer';

const initialState = {
  post: postInitState,
  groups: groupInitState,
};

export default initialState;
