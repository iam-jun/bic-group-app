import groupApi from '~/api/GroupApi';
import { IGroupDetailEdit } from '~/interfaces/IGroup';
import showToastEditSuccess from '~/store/entities/communities/actions/showToastEditSuccess';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';

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

    Store.store.dispatch(groupsActions.setGroupDetail(response?.data));
    callback?.();
  } catch (err) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m',
    );
    showError(err);
  }
};

export default editGroupDetail;
