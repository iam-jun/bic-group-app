import groupApi from '~/api/GroupApi';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { timeOut } from '~/utils/common';
import { IPayloadPutGroupStructureReorder } from '~/interfaces/IGroup';
import IGroupStructureState from '../Interface';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import showError from '~/store/helper/showError';

const navigation = withNavigation(rootNavigationRef);

const putGroupStructureReorder = (set, get) => async (payload: IPayloadPutGroupStructureReorder) => {
  const { communityId, newOrder } = payload || {};
  const data: IGroupStructureState = get();
  const { actions } = data || {};

  try {
    if (!communityId || !newOrder) {
      console.warn('\x1b[31m🐣️ putGroupStructureReorder invalid params\x1b[0m');
      return;
    }

    actions.setGroupStructureReorder({ loading: true, newOrder });
    const response = await groupApi.putGroupStructureReorder(
      communityId,
      newOrder,
    );

    if (response?.data) {
      actions.getGroupStructureCommunityTree({
        communityId,
        showLoading: false,
      });
      await timeOut(600); // wait for refresh group tree
      actions.setGroupStructureReorder({ loading: false });
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:group_structure:text_reorder_success',
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    } else {
      actions.setGroupStructureReorder({ loading: false, newOrder });
      showError(response);
    }
  } catch (err: any) {
    actions.setGroupStructureReorder({ loading: false, newOrder });
    console.error(
      'putGroupStructureReorder error:', err,
    );
    showError(err);
  }
};

export default putGroupStructureReorder;
