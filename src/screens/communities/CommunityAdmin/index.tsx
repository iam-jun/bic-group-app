import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';

import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../storeRedux/groups/keySelector';
import Text from '~/beinComponents/Text';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import modalActions from '~/storeRedux/modal/actions';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';

const CommunityAdmin = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const {
    id: communityId,
    name,
  } = useKeySelector(groupsKeySelector.communityDetail);

  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canEditProfileInfo = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    [
      PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_INFO,
      PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_PRIVACY,
    ],
  );
  const canManageGroupStructure = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.ORDER_MOVE_GROUP_STRUCTURE,
  );
  const canManageScheme = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.CRUD_COMMUNITY_OVERRIDE_SCHEME,
  );

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const onPressGeneralInfo = () => {
    rootNavigation.navigate(
      groupStack.generalInfo, {
        id: communityId,
        type: 'community',
      },
    );
  };

  const onPressPermission = () => {
    rootNavigation.navigate(groupStack.permissionScheme);
  };

  const onPressGroupStructure = () => {
    rootNavigation.navigate(groupStack.groupStructureSettings);
  };

  const renderModerating = () => (
    <>
      <Text.BodyM
        style={styles.headerTitle}
        color={theme.colors.neutral80}
        variant="bodyM"
        useI18n
      >
        settings:title_community_moderating
      </Text.BodyM>
      <MenuItem
        testID="community_admin.pending_posts"
        title="settings:title_pending_posts"
        icon="FileExclamation"
        iconProps={{
          icon: 'FileExclamation',
          tintColor: theme.colors.purple50,
        }}
        notificationsBadgeNumber={999}
        notificationsBadgeProps={{ maxNumber: 99, variant: 'alert' }}
        rightSubIcon="AngleRightSolid"
        onPress={displayNewFeature}
      />
    </>
  );

  const renderSettings = () => (
    <>
      <Text.BodyM
        style={styles.headerTitle}
        color={theme.colors.neutral80}
        variant="bodyM"
        useI18n
      >
        settings:title_community_settings
      </Text.BodyM>
      {!!canEditProfileInfo && (
        <MenuItem
          testID="community_admin.profile_info"
          title="settings:title_profile_info"
          icon="Gear"
          iconProps={{ icon: 'Gear', tintColor: theme.colors.purple50 }}
          rightSubIcon="AngleRightSolid"
          onPress={onPressGeneralInfo}
        />
      )}
      {!!canManageGroupStructure && (
        <MenuItem
          testID="community_admin.group_structure_settings"
          title="settings:title_group_structure"
          icon="CodeBranch"
          iconProps={{ icon: 'CodeBranch', tintColor: theme.colors.purple50 }}
          rightSubIcon="AngleRightSolid"
          onPress={onPressGroupStructure}
        />
      )}
      {!!canManageScheme && (
        <MenuItem
          testID="community_admin.permission_settings"
          title="settings:title_permission_settings"
          icon="FileLock"
          iconProps={{ icon: 'FileLock', tintColor: theme.colors.purple50 }}
          rightSubIcon="AngleRightSolid"
          onPress={onPressPermission}
        />
      )}
      <MenuItem
        testID="community_admin.post_settings"
        title="settings:title_post_settings"
        icon="Copy"
        iconProps={{ icon: 'Copy', tintColor: theme.colors.purple50 }}
        rightSubIcon="AngleRightSolid"
        onPress={displayNewFeature}
      />
    </>
  );

  return (
    <ScreenWrapper testID="CommunityAdmin" isFullView>
      <Header
        title={name}
        titleTextProps={{ color: theme.colors.neutral80 }}
      />
      <Divider size={4} />
      <View style={styles.container}>
        {renderModerating()}
        {renderSettings()}
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (theme: ExtendedTheme) => StyleSheet.create({
  container: {
    paddingTop: spacing.padding.large,
  },
  headerTitle: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.base,
  },
});

export default CommunityAdmin;
