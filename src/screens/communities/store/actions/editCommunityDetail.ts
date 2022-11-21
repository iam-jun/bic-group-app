import { ICommunityDetailEdit } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/store/helper/showError';
import groupApi from '~/api/GroupApi';
import showToastEditSuccess from './showToastEditSuccess';

const editCommunityDetail = (_set, _get) => async (
  data: ICommunityDetailEdit,
  editFieldName?: string,
  callback?: () => void,
) => {
  try {
    const communityId = data.id;
    const response = await groupApi.editCommunityDetail(communityId, data);
    if (response?.data) {
      useCommunitiesStore.getState().actions.updateCommunity(communityId, response.data);
    }

    if (editFieldName) showToastEditSuccess(editFieldName);

    callback?.();
  } catch (error) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', error, '\x1b[0m',
    );
    showError(error);
  }
};

export default editCommunityDetail;
