import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';

import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import Text from '~/beinComponents/Text';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import modalActions from '~/store/modal/actions';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import groupsActions from '../redux/actions';
import spacing from '~/theme/spacing';
import {useMyPermissions} from '~/hooks/permissions';

const CommunityAdmin = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {
    id: communityId,
    name,
    icon,
    can_manage_scheme,
    can_edit_info,
  } = useKeySelector(groupsKeySelector.communityDetail);
  const {total} = useKeySelector(groupsKeySelector.communityMemberRequests);

  const {hasPermissionsOnCurrentAudience, PERMISSION_KEY} = useMyPermissions();
  const canManageJoiningRequests = hasPermissionsOnCurrentAudience(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.APPROVE_REJECT_JOINING_REQUESTS,
  );
  const canEditProfileInfo = hasPermissionsOnCurrentAudience(
    'communities',
    communityId,
    [
      PERMISSION_KEY.COMMUNITY.EDIT_INFORMATION,
      PERMISSION_KEY.COMMUNITY.EDIT_PRIVACY,
    ],
  );

  useEffect(() => {
    canManageJoiningRequests &&
      dispatch(groupsActions.getCommunityMemberRequests({communityId}));

    return () => {
      dispatch(groupsActions.resetCommunityMemberRequests());
    };
  }, [communityId]);

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const onPressPendingMembers = () => {
    rootNavigation.navigate(groupStack.communityPendingMembers, {
      id: communityId,
    });
  };

  const onPressGeneralInfo = () => {
    rootNavigation.navigate(groupStack.generalInfo, {
      id: communityId,
      type: 'community',
    });
  };

  const onPressPermission = () => {
    rootNavigation.navigate(groupStack.communityPermission);
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
        useI18n>
        settings:title_community_moderating
      </Text.BodyM>
      {!!canManageJoiningRequests && (
        <MenuItem
          testID={'community_admin.pending_members'}
          title={'settings:title_pending_members'}
          icon={'UserCheck'}
          iconProps={{
            icon: 'UserCheck',
            tintColor: theme.colors.purple50,
          }}
          notificationsBadgeNumber={total}
          notificationsBadgeProps={{maxNumber: 99, variant: 'alert'}}
          rightSubIcon="AngleRightSolid"
          onPress={onPressPendingMembers}
        />
      )}
      <MenuItem
        testID={'community_admin.pending_posts'}
        title={'settings:title_pending_posts'}
        icon={'FileExclamation'}
        iconProps={{
          icon: 'FileExclamation',
          tintColor: theme.colors.purple50,
        }}
        notificationsBadgeNumber={999}
        notificationsBadgeProps={{maxNumber: 99, variant: 'alert'}}
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
        useI18n>
        settings:title_community_settings
      </Text.BodyM>
      {!!canEditProfileInfo && (
        <MenuItem
          testID="community_admin.profile_info"
          title="settings:title_profile_info"
          icon="Gear"
          iconProps={{icon: 'Gear', tintColor: theme.colors.purple50}}
          rightSubIcon="AngleRightSolid"
          onPress={onPressGeneralInfo}
        />
      )}
      {!!can_edit_info && ( //todo temp use can edit info, should use correct permission when BE update
        <MenuItem
          testID="community_admin.group_structure_settings"
          title="settings:title_group_structure"
          icon="CodeBranch"
          iconProps={{icon: 'CodeBranch', tintColor: theme.colors.purple50}}
          rightSubIcon="AngleRightSolid"
          onPress={onPressGroupStructure}
        />
      )}
      {!!can_manage_scheme && (
        <MenuItem
          testID="community_admin.permission_settings"
          title="settings:title_permission_settings"
          icon="FileLock"
          iconProps={{icon: 'FileLock', tintColor: theme.colors.purple50}}
          rightSubIcon="AngleRightSolid"
          onPress={onPressPermission}
        />
      )}
      <MenuItem
        testID="community_admin.post_settings"
        title="settings:title_post_settings"
        icon="Copy"
        iconProps={{icon: 'Copy', tintColor: theme.colors.purple50}}
        rightSubIcon="AngleRightSolid"
        onPress={displayNewFeature}
      />
    </>
  );

  return (
    <ScreenWrapper testID="CommunityAdmin" isFullView>
      <Header
        title={name}
        titleTextProps={{color: theme.colors.neutral80}}
        avatar={icon}
      />
      <Divider size={4} />
      <View style={styles.container}>
        {renderModerating()}
        {renderSettings()}
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.large,
    },
    headerTitle: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
  });
};

export default CommunityAdmin;
