import i18next from 'i18next';

import Text from '~/baseComponents/Text';
import { handleLeaveInnerGroups } from '../../helper';
import useGroupDetailStore from '../store';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useModalStore from '~/store/modal';

interface IUseLeaveGroup {
  groupId: string;
  username: string;
  privacy: GroupPrivacyType;
}

const useLeaveGroup = ({ groupId, username, privacy }: IUseLeaveGroup) => {
  const actions = useGroupDetailStore((state) => state.actions);
  const { showAlert } = useModalStore((state) => state.actions);

  const doLeaveGroup = () => {
    actions.leaveGroup(groupId, privacy);
  };

  const alertPayload = {
    iconName: 'ArrowRightFromArc',
    title: i18next.t('groups:modal_confirm_leave_group:title'),
    content: i18next.t('groups:modal_confirm_leave_group:description'),
    ContentComponent: Text.BodyS,
    cancelBtn: true,
    onConfirm: doLeaveGroup,
    confirmLabel: i18next.t('groups:modal_confirm_leave_group:button_leave'),
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
    showAlert(alertPayload);
  };

  const alertLeaveGroup = () => {
    handleLeaveInnerGroups(groupId, username, getInnerGroupsText);
  };

  return alertLeaveGroup;
};

export default useLeaveGroup;
