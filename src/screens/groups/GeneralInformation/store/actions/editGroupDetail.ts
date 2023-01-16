import groupApi from '~/api/GroupApi';
import { IGroupDetailEdit } from '~/interfaces/IGroup';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastEditSuccess from '~/store/entities/communities/actions/showToastEditSuccess';
import showToastError from '~/store/helper/showToastError';

const editGroupDetail = (_set, _get) => async (
  data: IGroupDetailEdit,
  editFieldName?: string,
  callback?: () => void,
) => {
  try {
    const groupId = data.id;
    delete data.id; // edit data should not contain group's id
    delete data.rootGroupId;

    const response = await groupApi.editGroupDetail(groupId, data);

    if (editFieldName) showToastEditSuccess(editFieldName);

    useGroupDetailStore.getState().actions.setGroupDetail(response?.data);
    callback?.();
  } catch (err) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default editGroupDetail;
