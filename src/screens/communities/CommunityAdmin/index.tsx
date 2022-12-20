import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';

import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import modalActions from '~/storeRedux/modal/actions';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';

const CommunityAdmin = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const community = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);
  const { name = '', groupId } = community || {};

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const canEditProfileInfo = shouldHavePermission(
    groupId,
    [
      PermissionKey.EDIT_INFO,
      PermissionKey.EDIT_PRIVACY,
    ],
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

const createStyles = () => StyleSheet.create({
  container: {
    paddingTop: spacing.padding.large,
  },
  headerTitle: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.base,
  },
});

export default CommunityAdmin;
