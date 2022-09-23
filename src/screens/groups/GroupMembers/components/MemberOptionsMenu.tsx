import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BottomSheet from '~/baseComponents/BottomSheet';
import Text from '~/beinComponents/Text';

import { IGroupMembers } from '~/interfaces/IGroup';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';

import useAuth from '~/hooks/auth';
import modalActions from '~/storeRedux/modal/actions';
import groupsActions from '../../../../storeRedux/groups/actions';
import useRemoveAdmin from './useRemoveAdmin';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import { useMyPermissions } from '~/hooks/permissions';
import { Button } from '~/baseComponents';
import useRemoveGroupMemberStore from '../store';

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
  const groupMembers = useKeySelector(groupsKeySelector.groupMembers);
  const alertRemovingAdmin = useRemoveAdmin({ groupId, selectedMember });

  const onPressMenuOption = (type: 'set-admin' | 'remove-admin' | 'remove-member') => {
    modalizeRef.current?.close();
    switch (type) {
      case 'set-admin':
        alertSettingAdmin();
        break;

      case 'remove-admin':
        onPressRemoveAdmin();
        break;

      case 'remove-member':
        onPressRemoveMember();
        break;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const alertSettingAdmin = () => {
    const alertPayload = {
      iconName: 'Star',
      title: t('groups:modal_confirm_set_admin:title'),
      content: t('groups:modal_confirm_set_admin:description'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      onConfirm: doSetAdmin,
      confirmLabel: t('groups:modal_confirm_set_admin:button_confirm'),
    };
    alertPayload.content = alertPayload.content.replace(
      '{0}',
      `"${selectedMember?.fullname}"`,
    );
    dispatch(modalActions.showAlert(alertPayload));
  };

  const doSetAdmin = () => {
    selectedMember?.id
      && dispatch(groupsActions.setGroupAdmin({ groupId, userIds: [selectedMember.id] }));
  };

  const onPressRemoveAdmin = () => {
    if (selectedMember?.id) {
      const adminCount = groupMembers?.groupAdmin?.userCount;
      if (adminCount > 1) {
        alertRemovingAdmin();
      } else {
        dispatch(modalActions.showHideToastMessage({
          content: 'groups:error:last_admin_remove',
          props: { type: 'error' },
        }));
      }
    }
  };

  const onConfirmRemoveMember = () => {
    if (selectedMember?.id) {
      deleteRemoveGroupMember({ groupId, userId: selectedMember.id });
    }
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

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      onClose={onOptionsClosed}
      ContentComponent={(
        <View>
          {!!canAssignUnassignRole && (
            selectedMember?.isAdmin ? (
              renderItem({
                testID: 'member_options_menu.remove_admin',
                content: 'groups:member_menu:label_revoke_admin_role',
                onPress: () => onPressMenuOption('remove-admin'),
              })
            ) : (
              renderItem({
                testID: 'member_options_menu.set_admin',
                content: 'groups:member_menu:label_set_as_admin',
                onPress: () => onPressMenuOption('set-admin'),
              })
            ))}
          {!!canRemoveMember && selectedMember?.username !== user?.username && (
            renderItem({
              testID: 'member_options_menu.remove_member',
              content: 'groups:member_menu:label_remove_member',
              onPress: () => onPressMenuOption('remove-member'),
            })
          )}
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
