import { t } from 'i18next';
import React from 'react';
import InvitePeopleToYourGroup from '~/components/InvitePeopleToYourGroup';
import useGroupJoinableUsersStore from '~/components/InvitePeopleToYourGroup/store';
import { ITypeGroup } from '~/interfaces/common';
import useModalStore from '~/store/modal';

interface IParams {
  type: ITypeGroup;
  groupId: string;
}

export const onPressButtonInvite = (params: IParams) => {
  const { type, groupId } = params;
  const { showModal } = useModalStore.getState().actions;
  showModal({
    isOpen: true,
    ContentComponent: <InvitePeopleToYourGroup type={type} groupId={groupId} />,
    props: { onClosed: () => onCloseModalInvitePeopleToYourGroup(params) },
  });
  return true;
};

export const onCloseModalInvitePeopleToYourGroup = (params: IParams) => {
  const { selectedUsers } = useGroupJoinableUsersStore.getState();
  if (selectedUsers.length > 0) {
    const { showAlert } = useModalStore.getState().actions;
    showAlert({
      title: t('common:alert_quit_without_completing:title'),
      content: t('common:alert_quit_without_completing:content'),
      confirmLabel: t('common:alert_quit_without_completing:button_quit'),
      cancelBtn: true,
      cancelLabel: t('common:alert_quit_without_completing:button_keep_editing'),
      onCancel: () => onCancel(params),
      onConfirm,
    });
    return true;
  }
};

export const onCancel = (params: IParams) => {
  onPressButtonInvite(params);
  return true;
};

export const onConfirm = () => {
  useGroupJoinableUsersStore.getState().actions.clearInviteData();
  return true;
};
