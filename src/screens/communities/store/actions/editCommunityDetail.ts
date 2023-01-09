import { IGroupDetailEdit } from '~/interfaces/IGroup';
import useCommunitiesStore from '~/store/entities/communities';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';

const editCommunityDetail = (_set, _get) => async (
  data: IGroupDetailEdit,
  callback?: () => void,
) => {
  try {
    const { id: communityId, rootGroupId: groupId } = data;
    delete data.id;
    delete data.rootGroupId;

    const response = await groupApi.editGroupDetail(groupId, data);
    if (response?.data) {
      useCommunitiesStore.getState().actions.getCommunity(communityId);
    }

    showToastSuccess(response);

    callback?.();
  } catch (error) {
    console.error(
      '\x1b[33m', 'editCommunityDetail : error', error, '\x1b[0m',
    );
    showToastError(error);
  }
};

export default editCommunityDetail;
