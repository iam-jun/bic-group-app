import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {IconType} from '~/resources/icons';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '../../redux/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import MenuItem from '~/beinComponents/list/items/MenuItem';

const GroupAdministration = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {name, icon} = useKeySelector(groupsKeySelector.groupDetail.group);
  const {total} = useKeySelector(groupsKeySelector.groupMemberRequests);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const can_edit_info = useKeySelector(
    groupsKeySelector.groupDetail.can_edit_info,
  );
  const can_edit_privacy = useKeySelector(
    groupsKeySelector.groupDetail.can_edit_privacy,
  );

  useEffect(() => {
    can_manage_member &&
      dispatch(groupsActions.getGroupMemberRequests({groupId}));

    return () => {
      dispatch(groupsActions.resetGroupMemberRequests());
    };
  }, [groupId]);

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const goToPendingMembers = () => {
    rootNavigation.navigate(groupStack.groupPendingMembers);
  };

  const goToGeneralInfo = () => {
    rootNavigation.navigate(groupStack.generalInfo, {id: groupId});
  };

  const renderItem = (
    icon: IconType,
    title: string,
    onPress?: () => void,
    notificationsBadgeNumber?: number,
    testID?: string,
  ) => {
    return (
      <MenuItem
        testID={testID}
        title={title}
        icon={icon}
        iconProps={{icon: icon, tintColor: theme.colors.primary6}}
        notificationsBadgeNumber={notificationsBadgeNumber}
        notificationsBadgeProps={{maxNumber: 99, variant: 'alert'}}
        rightSubIcon="AngleRightSolid"
        onPress={onPress}
      />
    );
  };

  const renderGroupModerating = () => (
    <>
      <Text.H5
        style={styles.headerTitle}
        color={theme.colors.textPrimary}
        variant="bodyM"
        useI18n>
        settings:title_group_moderating
      </Text.H5>
      {!!can_manage_member &&
        renderItem(
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
        color={theme.colors.textPrimary}
        variant="bodyM"
        useI18n>
        settings:title_group_settings
      </Text.H5>
      {(!!can_edit_info || !!can_edit_privacy) &&
        renderItem(
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
        titleTextProps={{color: theme.colors.textPrimary}}
        avatar={icon}
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

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.large,
    },
    itemContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.base,
    },
    settingsContainer: {
      marginHorizontal: 0,
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
