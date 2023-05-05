import { IGroupDetailEdit } from '~/interfaces/IGroup';
import useCommunitiesStore from '~/store/entities/communities';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import showToastEditSuccess from '~/store/entities/communities/actions/showToastEditSuccess';

const editCommunityDetail = (_set, _get) => async (
  data: IGroupDetailEdit,
  editFieldName?: string,
  callback?: () => void,
) => {
  try {
    const { id: communityId, rootGroupId: groupId } = data;
    delete data.id;
    delete data.rootGroupId;

    const response = await groupApi.editGroupDetail(groupId, data);
    if (response?.data) {
      await useCommunitiesStore.getState().actions.getCommunity(communityId);
    }

    if (editFieldName) showToastEditSuccess(editFieldName);

    callback?.();
  } catch (error) {
    console.error(
      '\x1b[33m', 'editCommunityDetail : error', error, '\x1b[0m',
    );
    showToastError(error);
  }
};

export default editCommunityDetail;
