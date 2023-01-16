import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import * as modalActions from '~/storeRedux/modal/actions';
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

const GroupAdministration = (props: any) => {
  const { params } = props.route;
  const { groupId } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group } = groups[currentGroupId] || {};
  const { name } = group || {};

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canEditProfileInfo = shouldHavePermission(
    groupId,
    [
      PermissionKey.EDIT_INFO,
      PermissionKey.EDIT_PRIVACY,
    ],
  );

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const goToGeneralInfo = () => {
    rootNavigation.navigate(
      groupStack.generalInfo, { id: groupId },
    );
  };

  const renderItem = (
    icon: IconType,
    title: string,
    onPress?: () => void,
    notificationsBadgeNumber?: number,
    testID?: string,
  ) => (
    <MenuItem
      testID={testID}
      title={title}
      icon={icon}
      iconProps={{ icon, tintColor: theme.colors.purple50 }}
      notificationsBadgeNumber={notificationsBadgeNumber}
      notificationsBadgeProps={{ maxNumber: 99, variant: 'alert' }}
      rightSubIcon="AngleRightSolid"
      onPress={onPress}
    />
  );

  const renderGroupModerating = () => (
    <>
      <Text.H5
        style={styles.headerTitle}
        color={theme.colors.neutral80}
        variant="bodyM"
        useI18n
      >
        settings:title_group_moderating
      </Text.H5>
      {renderItem(
        'FileExclamation',
        'settings:title_pending_posts',
        displayNewFeature,
        23,
        'group_administration.pending_posts',
      )}
    </>
  );

  const renderGroupSettings = () => (
    <>
      <Text.H5
        style={styles.headerTitle}
        color={theme.colors.neutral80}
        variant="bodyM"
        useI18n
      >
        settings:title_group_settings
      </Text.H5>
      {canEditProfileInfo
        && renderItem(
          'Gear',
          'settings:title_profile_info',
          goToGeneralInfo,
          undefined,
          'group_administration.profile_info',
        )}
      {renderItem(
        'Copy',
        'settings:title_post_settings',
        displayNewFeature,
        undefined,
        'group_administration.post_settings',
      )}
      {renderItem(
        'CircleUser',
        'settings:title_membership_settings',
        displayNewFeature,
        undefined,
        'group_administration.membership_settings',
      )}
    </>
  );

  return (
    <ScreenWrapper testID="GroupAdministration" isFullView>
      <Header
        title={name}
        titleTextProps={{ color: theme.colors.neutral80 }}
      />
      <Divider style={styles.divider} />
      <View style={styles.container}>
        {renderGroupModerating()}
        {renderGroupSettings()}
      </View>
    </ScreenWrapper>
  );
};

export default GroupAdministration;

const themeStyles = () => StyleSheet.create({
  container: {
    paddingTop: spacing.padding.large,
  },
  headerTitle: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.base,
  },
  divider: {
    height: 5,
  },
});
