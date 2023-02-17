import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '~/baseComponents';
import BottomSheet from '~/baseComponents/BottomSheet';
import Text from '~/baseComponents/Text';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import useAuthController, { IAuthState } from '~/screens/auth/store';
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
  onPressReportMember: () => void;
}

enum MemberOptions {
  SET_ADMIN_ROLE = 'set-admin',
  REVOKE_ADMIN_ROLE = 'revoke-admin',
  REMOVE_MEMBER = 'remove-member',
  REPORT_MEMBER = 'report-member',
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
  onPressReportMember,
}: MemberOptionsMenuProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const user = useAuthController(useCallback((state: IAuthState) => state.authUser, []));
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

      case MemberOptions.REPORT_MEMBER:
        onPressReportMember();
        break;
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

  const renderReportMemberOption = () => {
    if (isMe) return null;

    return renderItem({
      testID: 'member_options_menu.report_member',
      content: 'groups:member_menu:label_report_member',
      onPress: () => onPressMenuOption(MemberOptions.REPORT_MEMBER),
    });
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
          {renderReportMemberOption()}
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
