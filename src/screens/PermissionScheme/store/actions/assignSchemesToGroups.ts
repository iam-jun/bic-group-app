import Store from '~/storeRedux';
import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadGroupSchemeAssignments } from '~/interfaces/IGroup';
import showError from '~/store/helper/showError';
import IPermissionSchemeState from '../Interface';
import modalActions from '~/storeRedux/modal/actions';

const assignSchemesToGroups = (set, get) => async (payload: IPayloadGroupSchemeAssignments) => {
  const { communityId, data, currentAssignments } = payload || {};
  const permissionSchemeData: IPermissionSchemeState = get();
  const { actions } = permissionSchemeData;
  try {
    if (!communityId || !data) {
      console.warn('\x1b[31m🐣️ assignSchemesToGroups invalid params\x1b[0m');
      return;
    }

    actions.setGroupSchemeAssigning({
      loading: true,
      data,
      currentAssignments,
    });

    const response = await groupApi.assignSchemesToGroups(payload);

    if (response?.data) {
      actions.setGroupSchemeAssigning({
        loading: false,
        currentAssignments,
      });
      actions.getSchemes({ communityId, isRefreshing: true });
      actions.getGroupSchemeAssignments({ communityId, showLoading: false });

      const toastMessage: IToastMessage = {
        content: response.meta?.message || 'Success',
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    } else {
      actions.setGroupSchemeAssigning({
        loading: false,
        data,
        currentAssignments,
      });

      showError(response);
    }
  } catch (error) {
    console.error('assignSchemesToGroups error:', error);

    actions.setGroupSchemeAssigning({
      loading: false,
      data,
      currentAssignments,
    });

    showError(error);
  }
};

export default assignSchemesToGroups;
