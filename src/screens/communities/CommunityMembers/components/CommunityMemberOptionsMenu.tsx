import React from 'react';
import { useDispatch } from 'react-redux';

import { ICommunity, ICommunityMembers } from '~/interfaces/ICommunity';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import useCommunityMemberStore from '../store';
import useCommunityController from '../../store';
import MemberOptionsMenu from '~/components/Member/MemberOptionsMenu';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import ReportContent from '~/components/ReportContent';
import { TargetType } from '~/interfaces/IReport';

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

  const removeCommunityMember = useCommunityMemberStore(
    (state) => state.actions.removeCommunityMember,
  );
  const actions = useCommunityController((state) => state.actions);

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
    removeCommunityMember({ communityId, groupId, userId: selectedMember.id });
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

export default CommunityMemberOptionsMenu;
