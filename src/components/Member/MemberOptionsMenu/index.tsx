import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Button } from '~/baseComponents';
import BottomSheet from '~/baseComponents/BottomSheet';
import Text from '~/beinComponents/Text';
import useAuth from '~/hooks/auth';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import modalActions from '~/storeRedux/modal/actions';
import { spacing } from '~/theme';

interface MemberOptionsMenuProps {
  modalizeRef: any;
  selectedMember: ICommunityMembers | IGroupMembers;
  canAssignUnassignRole: boolean;
  canRemoveMember: boolean;
  onOptionsClosed: () => void;
  onPressSetAdminRole: () => void;
  onPressRevokeAdminRole: () => void;
  onPressRemoveMember: () => void;
}

enum MemberOptions {
  SET_ADMIN_ROLE = 'set-admin',
  REVOKE_ADMIN_ROLE = 'revoke-admin',
  REMOVE_MEMBER = 'remove-member'
}

const MemberOptionsMenu = ({
  modalizeRef,
  selectedMember,
  canAssignUnassignRole,
  canRemoveMember,
  onOptionsClosed,
  onPressSetAdminRole,
  onPressRevokeAdminRole,
  onPressRemoveMember,
}: MemberOptionsMenuProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const styles = createStyles();
  const { user } = useAuth();
  const isMe = selectedMember?.username === user?.username;

  const onPressMenuOption = (type: MemberOptions) => {
    modalizeRef.current?.close();
    switch (type) {
      case MemberOptions.SET_ADMIN_ROLE:
        onPressSetAdminRole();
        break;

      case MemberOptions.REVOKE_ADMIN_ROLE:
        onPressRevokeAdminRole();
        break;

      case MemberOptions.REMOVE_MEMBER:
        onPressRemoveMember();
        break;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
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

  const renderRevokeAdminRoleOption = () => {
    if (canAssignUnassignRole && selectedMember?.isAdmin) {
      return renderItem({
        testID: 'member_options_menu.remove_admin',
        content: 'groups:member_menu:label_revoke_admin_role',
        onPress: () => onPressMenuOption(MemberOptions.REVOKE_ADMIN_ROLE),
      });
    }

    return null;
  };

  const renderSetAdminRoleOption = () => {
    if (canAssignUnassignRole && !selectedMember?.isAdmin) {
      return renderItem({
        testID: 'member_options_menu.set_admin',
        content: 'groups:member_menu:label_set_as_admin',
        onPress: () => onPressMenuOption(MemberOptions.SET_ADMIN_ROLE),
      });
    }

    return null;
  };

  const renderRemoveMemberOption = () => {
    if (canRemoveMember && !isMe) {
      return renderItem({
        testID: 'member_options_menu.remove_member',
        content: 'groups:member_menu:label_remove_member',
        onPress: () => onPressMenuOption(MemberOptions.REMOVE_MEMBER),
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
          {renderRevokeAdminRoleOption()}
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
