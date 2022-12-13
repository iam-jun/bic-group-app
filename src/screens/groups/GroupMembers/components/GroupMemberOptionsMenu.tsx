import React from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';

import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import { useMyPermissions } from '~/hooks/permissions';
import useRemoveGroupMemberStore from '../store';
import MemberOptionsMenu from '~/components/Member/MemberOptionsMenu';
import useGroupController from '../../store';

interface GroupMemberOptionsMenuProps {
  groupId: string;
  modalizeRef: any;
  selectedMember: IGroupMembers;
  onOptionsClosed: () => void;
}

const GroupMemberOptionsMenu = ({
  groupId,
  modalizeRef,
  selectedMember,
  onOptionsClosed,
}: GroupMemberOptionsMenuProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const actions = useGroupController((state) => state.actions);
  const deleteRemoveGroupMember = useRemoveGroupMemberStore(
    (state) => state.actions.deleteRemoveGroupMember,
  );

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canRemoveMember = hasPermissionsOnScopeWithId(
    groupId,
    PERMISSION_KEY.REMOVE_MEMBER,
  );
  const canAssignUnassignRole = hasPermissionsOnScopeWithId(
    groupId,
    PERMISSION_KEY.ASSIGN_UNASSIGN_ROLE,
  );

  const onPressSetAdminRole = () => {
    if (!selectedMember?.id) return;
    actions.assignGroupAdmin(groupId, [selectedMember.id]);
  };

  const onConfirmRemoveAdminRole = () => {
    actions.revokeGroupAdmin(groupId, selectedMember.id);
  };

  const onPressRevokeAdminRole = () => {
    if (!selectedMember?.id) return;

    dispatch(modalActions.showAlert({
      title: t('groups:modal_confirm_remove_admin:title'),
      content: t('groups:modal_confirm_remove_admin:content').replace('{0}', selectedMember.fullname),
      confirmLabel: t('groups:modal_confirm_remove_admin:button_confirm'),
      cancelBtn: true,
      onConfirm: onConfirmRemoveAdminRole,
    }));
  };

  const onConfirmRemoveMember = () => {
    if (!selectedMember?.id) return;

    deleteRemoveGroupMember({ groupId, userId: selectedMember.id });
  };

  const onPressRemoveMember = () => {
    dispatch(modalActions.showAlert({
      title: t('groups:modal_confirm_remove_member:title'),
      content: t('groups:modal_confirm_remove_member:content'),
      confirmLabel: t('groups:modal_confirm_remove_member:button_remove'),
      cancelBtn: true,
      onConfirm: onConfirmRemoveMember,
    }));
  };

  return (
    <MemberOptionsMenu
      modalizeRef={modalizeRef}
      selectedMember={selectedMember}
      canAssignUnassignRole={canAssignUnassignRole}
      canRemoveMember={canRemoveMember}
      onOptionsClosed={onOptionsClosed}
      onPressSetAdminRole={onPressSetAdminRole}
      onPressRevokeAdminRole={onPressRevokeAdminRole}
      onPressRemoveMember={onPressRemoveMember}
    />
  );
};

export default GroupMemberOptionsMenu;
