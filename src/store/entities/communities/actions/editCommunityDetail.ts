import { ICommunityDetailEdit } from '~/interfaces/ICommunity';
import Store from '~/storeRedux';
import appActions from '~/storeRedux/app/actions';
import groupApi from '../../../../api/GroupApi';
import showToastEditSuccess from './showToastEditSuccess';

const editCommunityDetail = (set, _) => async (
  data: ICommunityDetailEdit,
  editFieldName?: string,
  callback?: () => void,
) => {
  try {
    const communityId = data.id;
    const response = await groupApi.editCommunityDetail(communityId, data);
    if (response?.data) {
      set((state) => {
        state.data[communityId] = { ...state.data[communityId], ...response.data };
      }, 'editCommunityDetail');
    }

    if (editFieldName) showToastEditSuccess(editFieldName);

    callback?.();
  } catch (error) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', error, '\x1b[0m',
    );
    Store.store.dispatch(appActions.setShowError(error));

    // just in case there is some error regarding editing images url
    // yield put(groupsActions.setLoadingAvatar(false));
    // yield put(groupsActions.setLoadingCover(false));
  }
};

export default editCommunityDetail;
