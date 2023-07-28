import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';

import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { ITypeGroup } from '~/interfaces/common';
import { IconType } from '~/resources/icons';

const CommunityAdmin = (props: any) => {
  const { params } = props.route;
  const communityId = params?.communityId;

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
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

  const canEditJoinSetting = shouldHavePermission(groupId, PermissionKey.EDIT_JOIN_SETTING);

  const onPressGeneralInfo = () => {
    rootNavigation.navigate(
      groupStack.generalInfo, {
        id: communityId,
        type: 'community',
      },
    );
  };

  const onPressMembershipPolicySettings = () => {
    rootNavigation.navigate(groupStack.membershipPolicySettings, {
      communityId,
      groupId,
      type: ITypeGroup.COMMUNITY,
    });
  };

  const onPressScheduleContent = () => {
    rootNavigation.navigate(
      articleStack.articleScheduleContent, { groupId },
    );
  };

  const renderMenuItem = (props: {
    testID: string;
    title: string;
    icon: IconType;
    rightSubIcon: IconType;
    onPress: () => void;
    style: StyleProp<ViewStyle>;
  }) => {
    const {
      testID, title, icon, rightSubIcon, onPress, style,
    } = props;
    return (
      <View style={style}>
        <MenuItem
          testID={testID}
          title={title}
          icon={icon}
          iconProps={styles.iconProps}
          rightSubIcon={rightSubIcon}
          onPress={onPress}
          style={styles.menuItemChild}
        />
      </View>
    );
  };

  const renderSettings = () => (
    <>
      <Text.H4 style={styles.headerTitle} color={theme.colors.neutral80} useI18n>
        settings:title_community_settings
      </Text.H4>
      {!!canEditProfileInfo
        && renderMenuItem({
          testID: 'community_admin.profile_info',
          title: 'settings:title_profile_info',
          icon: 'MemoCircleInfoSolid',
          rightSubIcon: 'ChevronRight',
          onPress: onPressGeneralInfo,
          style: styles.firstMenuItem,
        })}
      {!!canEditJoinSetting
        && renderMenuItem({
          testID: 'community_admin.membership_policy_settings',
          title: 'settings:membership_policy_settings:title',
          icon: 'UsersMedicalSolid',
          rightSubIcon: 'ChevronRight',
          onPress: onPressMembershipPolicySettings,
          style: styles.menuItem,
        })}
      {renderMenuItem({
        testID: 'community_admin.schedule_content',
        title: 'settings:title_schedule_content',
        icon: 'SquareListSolid',
        rightSubIcon: 'ChevronRight',
        onPress: onPressScheduleContent,
        style: styles.menuItem,
      })}
    </>
  );

  return (
    <ScreenWrapper testID="CommunityAdmin" isFullView>
      <Header
        title={name}
        titleTextProps={{ color: theme.colors.neutral80 }}
      />
      <Divider size={spacing.margin.large} />
      <View style={styles.container}>
        {renderSettings()}
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (theme: ExtendedTheme) => StyleSheet.create({
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

export default CommunityAdmin;
