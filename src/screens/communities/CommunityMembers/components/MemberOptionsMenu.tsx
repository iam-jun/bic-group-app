import React from 'react';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { View, StyleSheet } from 'react-native';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import BottomSheet from '~/baseComponents/BottomSheet';
import { useMyPermissions } from '~/hooks/permissions';
import useAuth from '~/hooks/auth';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import Text from '~/beinComponents/Text';
import useRemoveCommunityMemberStore from '../store';
import useCommunityController from '../../store';

interface MemberOptionsMenuProps {
  communityId: string;
  modalizeRef: any;
  selectedMember: ICommunityMembers;
  onOptionsClosed: () => void;
}

export enum MemberOptions {
  SetAdminRole = 'set-admin',
  RemoveAdminRole = 'remove-admin',
  RemoveMember = 'remove-member'
}

const MemberOptionsMenu = ({
  communityId,
  modalizeRef,
  selectedMember,
  onOptionsClosed,
}: MemberOptionsMenuProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const styles = createStyles();
  const { user } = useAuth();
  const { t } = useBaseHook();
  const isMe = selectedMember?.username === user?.username;

  const deleteRemoveCommunityMember = useRemoveCommunityMemberStore(
    (state) => state.actions.deleteRemoveCommunityMember,
  );
  const actions = useCommunityController((state) => state.actions);

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canRemoveMember = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.ADD_REMOVE_COMMUNITY_MEMBER,
  );
  const canAssignUnassignRole = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.ASSIGN_UNASSIGN_ROLE_IN_COMMUNITY,
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

    actions.assignCommunityAdmin(communityId, [selectedMember.id]);
  };

  const onConfirmRemoveAdminRole = () => {
    actions.revokeCommunityAdmin(communityId, [selectedMember.id]);
  };

  const onPressRemoveAdminRole = () => {
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

const createStyles = () => StyleSheet.create({
  menuOption: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.base,
  },
});

export default MemberOptionsMenu;
