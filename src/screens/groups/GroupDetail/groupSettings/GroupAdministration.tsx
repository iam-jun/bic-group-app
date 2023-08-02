import React from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useRootNavigation } from '~/hooks/navigation';
import { IconType } from '~/resources/icons';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/baseComponents/Text';
import Divider from '~/beinComponents/Divider';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import spacing from '~/theme/spacing';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

const GroupAdministration = (props: any) => {
  const { params } = props.route;
  const { groupId } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const groups = useGroupsStore((state: IGroupsState) => state.groups);
  const { group } = groups[groupId] || {};
  const { name } = group || {};

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canEditProfileInfo = shouldHavePermission(groupId, [PermissionKey.EDIT_INFO, PermissionKey.EDIT_PRIVACY]);

  const canEditJoinSetting = shouldHavePermission(groupId, PermissionKey.EDIT_JOIN_SETTING);

  const goToGeneralInfo = () => {
    rootNavigation.navigate(groupStack.generalInfo, { id: groupId });
  };

  const goToMembershipPolicySettings = () => {
    rootNavigation.navigate(groupStack.membershipPolicySettings, { groupId });
  };

  const goToScheduleContent = () => {
    rootNavigation.navigate(articleStack.articleScheduleContent, { groupId });
  };

  const renderItem = (
    icon: IconType,
    title: string,
    onPress?: () => void,
    notificationsBadgeNumber?: number,
    testID?: string,
    style?: StyleProp<ViewStyle>,
  ) => (
    <View style={style}>
      <MenuItem
        testID={testID}
        title={title}
        icon={icon}
        iconProps={styles.iconProps}
        notificationsBadgeNumber={notificationsBadgeNumber}
        notificationsBadgeProps={{ maxNumber: 99, variant: 'alert' }}
        rightSubIcon="ChevronRight"
        onPress={onPress}
        style={styles.menuItemChild}
      />
    </View>
  );

  const renderGroupSettings = () => (
    <>
      <Text.H4 style={styles.headerTitle} color={theme.colors.neutral80} useI18n>
        settings:title_group_settings
      </Text.H4>
      {!!canEditProfileInfo
        && renderItem(
          'MemoCircleInfoSolid',
          'settings:title_profile_info',
          goToGeneralInfo,
          undefined,
          'group_administration.profile_info',
          styles.firstMenuItem,
        )}
      {!!canEditJoinSetting
        && renderItem(
          'UsersMedicalSolid',
          'settings:membership_policy_settings:title',
          goToMembershipPolicySettings,
          undefined,
          'group_administration.membership_policy_settings',
          styles.menuItem,
        )}
      {renderItem(
        'SquareListSolid',
        'settings:title_schedule_content',
        goToScheduleContent,
        undefined,
        'group_administration.schedule_content',
        styles.menuItem,
      )}
    </>
  );

  return (
    <ScreenWrapper testID="GroupAdministration" isFullView>
      <Header title={name} titleTextProps={{ color: theme.colors.neutral80 }} />
      <Divider size={spacing.margin.large} />
      <View style={styles.container}>{renderGroupSettings()}</View>
    </ScreenWrapper>
  );
};

export default GroupAdministration;

const themeStyles = (theme: ExtendedTheme) => StyleSheet.create({
  container: {
    paddingTop: spacing.margin.xTiny + spacing.margin.base,
  },
  headerTitle: {
    marginHorizontal: spacing.margin.large,
  },
  iconProps: {
    tintColor: theme.colors.neutral20,
    size: 18,
  },
  firstMenuItem: {
    marginTop: spacing.margin.xSmall + spacing.margin.large,
  },
  menuItem: {
    marginTop: spacing.margin.big,
  },
  menuItemChild: {
    paddingVertical: 0,
  },
});
