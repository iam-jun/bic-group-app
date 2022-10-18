import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BottomSheet from '~/baseComponents/BottomSheet';
import Text from '~/beinComponents/Text';

import { IGroupMembers } from '~/interfaces/IGroup';

import useAuth from '~/hooks/auth';
import modalActions from '~/storeRedux/modal/actions';
import groupsActions from '../../../../storeRedux/groups/actions';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import { useMyPermissions } from '~/hooks/permissions';
import { Button } from '~/baseComponents';
import useRemoveGroupMemberStore from '../store';
import { MemberOptions } from '~/screens/communities/CommunityMembers/components/MemberOptionsMenu';

interface MemberOptionsMenuProps {
  groupId: string;
  modalizeRef: any;
  selectedMember: IGroupMembers;
  onOptionsClosed: () => void;
}

const MemberOptionsMenu = ({
  groupId,
  modalizeRef,
  selectedMember,
  onOptionsClosed,
}: MemberOptionsMenuProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { t } = useBaseHook();
  const isMe = selectedMember?.username === user?.username;

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

  const onPressMenuOption = (type: MemberOptions) => {
    modalizeRef.current?.close();
    switch (type) {
      case MemberOptions.SetAdminRole:
        onPressSetAdminRole();
        break;

      case MemberOptions.RemoveAdminRole:
        onPressRemoveAdminRole();
        break;

      case MemberOptions.RemoveMember:
        onPressRemoveMember();
        break;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

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

  const renderItem = ({ content, testID, onPress }: {content: string; testID?: string; onPress: () => void}) => (
    <Button onPress={onPress}>
      <Text.BodyM
        testID={testID}
        color={colors.neutral40}
        style={styles.menuOption}
        useI18n
      >
        {content}
      </Text.BodyM>
    </Button>
  );

  const renderRemoveAdminRoleOption = () => {
    if (canAssignUnassignRole && selectedMember?.isAdmin) {
      return renderItem({
        testID: 'member_options_menu.remove_admin',
        content: 'groups:member_menu:label_revoke_admin_role',
        onPress: () => onPressMenuOption(MemberOptions.RemoveAdminRole),
      });
    }

    return null;
  };

  const renderSetAdminRoleOption = () => {
    if (canAssignUnassignRole && !selectedMember?.isAdmin) {
      return renderItem({
        testID: 'member_options_menu.set_admin',
        content: 'groups:member_menu:label_set_as_admin',
        onPress: () => onPressMenuOption(MemberOptions.SetAdminRole),
      });
    }

    return null;
  };

  const renderRemoveMemberOption = () => {
    if (canRemoveMember && !isMe) {
      return renderItem({
        testID: 'member_options_menu.remove_member',
        content: 'groups:member_menu:label_remove_member',
        onPress: () => onPressMenuOption(MemberOptions.RemoveMember),
      });
    }

    return null;
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      onClose={onOptionsClosed}
      ContentComponent={(
        <View>
          {renderRemoveAdminRoleOption()}
          {renderSetAdminRoleOption()}
          {renderRemoveMemberOption()}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  menuOption: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.base,
  },
});

export default MemberOptionsMenu;
