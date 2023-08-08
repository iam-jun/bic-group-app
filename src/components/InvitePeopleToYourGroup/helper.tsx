import { t } from 'i18next';
import React from 'react';
import InvitePeopleToYourGroup from '~/components/InvitePeopleToYourGroup';
import useGroupJoinableUsersStore from '~/components/InvitePeopleToYourGroup/store';
import useModalStore from '~/store/modal';

export const onPressButtonInvite = (groupId: string) => {
  const { showModal } = useModalStore.getState().actions;
  showModal({
    isOpen: true,
    ContentComponent: <InvitePeopleToYourGroup groupId={groupId} />,
    props: { onClosed: () => onCloseModalInvitePeopleToYourGroup(groupId) },
  });
  return true;
};

export const onCloseModalInvitePeopleToYourGroup = (groupId: string) => {
  const { selectedUsers } = useGroupJoinableUsersStore.getState();
  if (selectedUsers.length > 0) {
    const { showAlert } = useModalStore.getState().actions;
    showAlert({
      title: t('common:alert_quit_without_completing:title'),
      content: t('common:alert_quit_without_completing:content'),
      confirmLabel: t('common:alert_quit_without_completing:button_quit'),
      cancelBtn: true,
      cancelLabel: t('common:alert_quit_without_completing:button_keep_editing'),
      onCancel: () => onCancel(groupId),
      onConfirm,
    });
    return true;
  }
};

export const onCancel = (groupId: string) => {
  onPressButtonInvite(groupId);
  return true;
};

export const onConfirm = () => {
  useGroupJoinableUsersStore.getState().reset();
  return true;
};
