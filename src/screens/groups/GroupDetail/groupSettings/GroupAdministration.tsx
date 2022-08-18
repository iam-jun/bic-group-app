import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import * as modalActions from '~/storeRedux/modal/actions';
import { useRootNavigation } from '~/hooks/navigation';
import { IconType } from '~/resources/icons';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '../../../../storeRedux/groups/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';

const GroupAdministration = (props: any) => {
  const { params } = props.route;
  const { groupId } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { name, icon } = useKeySelector(groupsKeySelector.groupDetail.group);
  const { total } = useKeySelector(groupsKeySelector.groupMemberRequests);

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canManageJoiningRequests = hasPermissionsOnScopeWithId(
    'groups',
    groupId,
    PERMISSION_KEY.GROUP.APPROVE_REJECT_GROUP_JOINING_REQUESTS,
  );
  const canEditProfileInfo = hasPermissionsOnScopeWithId(
    'groups', groupId, [
      PERMISSION_KEY.GROUP.EDIT_GROUP_INFO,
      PERMISSION_KEY.GROUP.EDIT_GROUP_PRIVACY,
    ],
  );

  useEffect(
    () => {
      canManageJoiningRequests
      && dispatch(groupsActions.getGroupMemberRequests({ groupId }));

      return () => {
        dispatch(groupsActions.resetGroupMemberRequests());
      };
    }, [groupId],
  );

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const goToPendingMembers = () => {
    rootNavigation.navigate(
      groupStack.groupPendingMembers, { id: groupId },
    );
  };

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
      {!!canManageJoiningRequests
        && renderItem(
          'UserCheck',
          'settings:title_pending_members',
          goToPendingMembers,
          total,
          'group_administration.pending_members',
        )}
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

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
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
};
