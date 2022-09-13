import { useDispatch } from 'react-redux';
import i18next from 'i18next';

import modalActions from '~/storeRedux/modal/actions';
import groupsActions from '../../../../storeRedux/groups/actions';
import Text from '~/beinComponents/Text';

import { handleLeaveInnerGroups } from '../../helper';
import { Button } from '~/baseComponents';

interface IUseLeaveGroup {
  groupId: string;
  username: string;
}

const useLeaveGroup = ({ groupId, username }: IUseLeaveGroup) => {
  const dispatch = useDispatch();

  const doLeaveGroup = () => {
    dispatch(groupsActions.leaveGroup(groupId));
  };

  const alertPayload = {
    iconName: 'ArrowRightFromArc',
    title: i18next.t('groups:modal_confirm_leave_group:title'),
    content: i18next.t('groups:modal_confirm_leave_group:description'),
    ContentComponent: Text.BodyS,
    cancelBtn: true,
    onConfirm: doLeaveGroup,
    confirmLabel: i18next.t('groups:modal_confirm_leave_group:button_leave'),
    ConfirmBtnComponent: Button.Danger,
  };

  const getInnerGroupsText = (innerGroups: any) => {
    if (innerGroups.length > 0) {
      alertPayload.content
        += ` ${i18next.t('groups:modal_confirm_leave_group:leave_inner_groups')}`;

      const groupsLeaveToString = innerGroups.join(', ');
      alertPayload.content = alertPayload.content.replace(
        '{0}',
        groupsLeaveToString,
      );
    }
    dispatch(modalActions.showAlert(alertPayload));
  };

  const alertLeaveGroup = () => {
    handleLeaveInnerGroups(
      groupId, username, dispatch, getInnerGroupsText,
    );
  };

  return alertLeaveGroup;
};

export default useLeaveGroup;
