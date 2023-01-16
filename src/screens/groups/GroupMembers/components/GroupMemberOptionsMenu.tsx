import React from 'react';
import { useDispatch } from 'react-redux';

import { IGroupMembers } from '~/interfaces/IGroup';

import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import useMyPermissionsStore from '~/store/permissions';
import useGroupMemberStore from '../store';
import MemberOptionsMenu from '~/components/Member/MemberOptionsMenu';
import { PermissionKey } from '~/constants/permissionScheme';
import ReportContent from '~/components/Report/ReportContent';
import { TargetType } from '~/interfaces/IReport';
import useGroupsStore from '~/store/entities/groups';
import groupsSelector from '~/store/entities/groups/selectors';
import useModalStore from '~/store/modal';

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

  const groupDetail = useGroupsStore(groupsSelector.getGroup(groupId, {}));
  const { group } = groupDetail || {};
  const { communityId } = group || {};
  const { showAlert } = useModalStore((state) => state.actions);

  const actions = useGroupMemberStore((state) => state.actions);
  const deleteRemoveGroupMember = useGroupMemberStore(
    (state) => state.actions.deleteRemoveGroupMember,
  );

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canRemoveMember = shouldHavePermission(
    groupId,
    PermissionKey.REMOVE_MEMBER,
  );
  const canAssignUnassignRole = shouldHavePermission(
    groupId,
    PermissionKey.ASSIGN_UNASSIGN_ROLE,
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

    showAlert({
      title: t('groups:modal_confirm_remove_admin:title'),
      content: t('groups:modal_confirm_remove_admin:content').replace('{0}', selectedMember.fullname),
      confirmLabel: t('groups:modal_confirm_remove_admin:button_confirm'),
      cancelBtn: true,
      onConfirm: onConfirmRemoveAdminRole,
    });
  };

  const onConfirmRemoveMember = () => {
    if (!selectedMember?.id) return;

    deleteRemoveGroupMember({ groupId, userId: selectedMember.id });
  };

  const onPressRemoveMember = () => {
    showAlert({
      title: t('groups:modal_confirm_remove_member:title'),
      content: t('groups:modal_confirm_remove_member:content'),
      confirmLabel: t('groups:modal_confirm_remove_member:button_remove'),
      cancelBtn: true,
      onConfirm: onConfirmRemoveMember,
    });
  };

  const onPressReportMember = () => {
    if (!selectedMember?.id) return;

    const dataReportMember = {
      communityId,
    };

    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: <ReportContent
        targetId={selectedMember?.id}
        targetType={TargetType.MEMBER}
        dataReportMember={dataReportMember}
      />,
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
      onPressReportMember={onPressReportMember}
    />
  );
};

export default GroupMemberOptionsMenu;
