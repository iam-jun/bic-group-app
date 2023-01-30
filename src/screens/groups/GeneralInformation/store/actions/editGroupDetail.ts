import groupApi from '~/api/GroupApi';
import { IGroupDetailEdit } from '~/interfaces/IGroup';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const editGroupDetail = (_set, _get) => async (
  data: IGroupDetailEdit,
  callback?: () => void,
) => {
  try {
    const groupId = data.id;
    delete data.id; // edit data should not contain group's id
    delete data.rootGroupId;

    const response = await groupApi.editGroupDetail(groupId, data);

    showToastSuccess(response);
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
