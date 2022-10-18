import React from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';

import modalActions from '~/storeRedux/modal/actions';
import groupsActions from '../../../../storeRedux/groups/actions';
import { useBaseHook } from '~/hooks';
import { useMyPermissions } from '~/hooks/permissions';
import useRemoveGroupMemberStore from '../store';
import MemberOptionsMenu from '~/components/Member/MemberOptionsMenu';

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

  const deleteRemoveGroupMember = useRemoveGroupMemberStore(
    (state) => state.actions.deleteRemoveGroupMember,
  );

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canRemoveMember = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.ADD_REMOVE_GROUP_MEMBER,
  );
  const canAssignUnassignRole = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.ASSIGN_UNASSIGN_ROLE_IN_GROUP,
  );

  const onPressSetAdminRole = () => {
    if (!selectedMember?.id) return;

    dispatch(groupsActions.setGroupAdmin({ groupId, userIds: [selectedMember.id] }));
  };

  const onConfirmRemoveAdminRole = () => {
    dispatch(groupsActions.removeGroupAdmin({ groupId, userId: selectedMember.id }));
  };

  const onPressRemoveAdminRole = () => {
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
      onPressRemoveAdminRole={onPressRemoveAdminRole}
      onPressRemoveMember={onPressRemoveMember}
    />
  );
};

export default GroupMemberOptionsMenu;
