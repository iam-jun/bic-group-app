import React from 'react';
import { useDispatch } from 'react-redux';

import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import { useMyPermissions } from '~/hooks/permissions';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import useRemoveCommunityMemberStore from '../store';
import useCommunityController from '../../store';
import MemberOptionsMenu from '~/components/Member/MemberOptionsMenu';

interface CommunityMemberOptionsMenuProps {
  community: ICommunity;
  modalizeRef: any;
  selectedMember: ICommunityMembers;
  onOptionsClosed: () => void;
}

const CommunityMemberOptionsMenu = ({
  community,
  modalizeRef,
  selectedMember,
  onOptionsClosed,
}: CommunityMemberOptionsMenuProps) => {
  const { id: communityId, groupId } = community;
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const deleteRemoveCommunityMember = useRemoveCommunityMemberStore(
    (state) => state.actions.deleteRemoveCommunityMember,
  );
  const actions = useCommunityController((state) => state.actions);

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

    actions.assignCommunityAdmin(groupId, [selectedMember.id]);
  };

  const onConfirmRemoveAdminRole = () => {
    actions.revokeCommunityAdmin(groupId, selectedMember.id);
  };

  const onPressRevokeAdminRole = () => {
    if (!selectedMember?.id) return;

    dispatch(modalActions.showAlert({
      title: t('communities:modal_confirm_remove_admin:title'),
      content: t('communities:modal_confirm_remove_admin:content').replace('{0}', selectedMember.fullname),
      confirmLabel: t('communities:modal_confirm_remove_admin:button_confirm'),
      cancelBtn: true,
      onConfirm: onConfirmRemoveAdminRole,
    }));
  };

  const onConfirmRemoveMember = () => {
    if (!selectedMember?.id) return;

    deleteRemoveCommunityMember({ communityId, userId: selectedMember.id });
  };

  const onPressRemoveMember = () => {
    dispatch(modalActions.showAlert({
      title: t('communities:modal_confirm_remove_member:title'),
      content: t('communities:modal_confirm_remove_member:content'),
      confirmLabel: t('communities:modal_confirm_remove_member:button_remove'),
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

export default CommunityMemberOptionsMenu;
