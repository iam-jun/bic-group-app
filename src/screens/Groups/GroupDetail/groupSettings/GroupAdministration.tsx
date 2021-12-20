import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
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
import ListView from '~/beinComponents/list/ListView';
import {groupSettings} from '~/constants/groupAdminSettings';
import MenuItem from '~/beinComponents/list/items/MenuItem';

const GroupAdministration = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {name, icon} = useKeySelector(groupsKeySelector.groupDetail.group);
  const totalPendingMembers = useKeySelector(
    groupsKeySelector.groupDetail.total_pending_members,
  );

  useEffect(() => {
    dispatch(groupsActions.getGroupDetail(groupId));
  }, [groupId]);

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const onGroupAdminPress = (item: any) => {
    const {type} = item;
    switch (type) {
      case 'generalInfo':
        goToGeneralInfo();
        break;
      default:
        displayNewFeature();
        break;
    }
  };

  const goToPendingMembers = () => {
    rootNavigation.navigate(groupStack.pendingMembers, {groupId});
  };

  const goToGeneralInfo = () => {
    rootNavigation.navigate(groupStack.generalInfo, {groupId});
  };

  const renderItem = (
    icon: IconType,
    title: string,
    onPress?: () => void,
    notificationsBadgeNumber?: number,
  ) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <MenuItem
          title={title}
          icon={icon}
          notificationsBadgeNumber={notificationsBadgeNumber}
          notificationsBadgeProps={{maxNumber: 99, variant: 'alert'}}
          rightSubIcon="AngleRightB"
        />
      </TouchableOpacity>
    );
  };

  const renderGroupModerating = () => (
    <>
      <Text.H5
        style={styles.headerTitle}
        color={theme.colors.textSecondary}
        useI18n>
        settings:title_group_moderating
      </Text.H5>
      {renderItem(
        'UserExclamation',
        'settings:title_pending_members',
        goToPendingMembers,
        totalPendingMembers,
      )}
      {renderItem(
        'FileExclamationAlt',
        'settings:title_pending_posts',
        displayNewFeature,
        23,
      )}
      {renderItem(
        'ExclamationTriangle',
        'settings:title_reported_posts',
        displayNewFeature,
        1,
      )}
    </>
  );

  const renderGroupSettings = () => (
    <>
      <Text.H5
        style={styles.headerTitle}
        color={theme.colors.textSecondary}
        useI18n>
        settings:title_group_settings
      </Text.H5>
      <ListView
        type="menu"
        data={groupSettings}
        scrollEnabled={false}
        onItemPress={onGroupAdminPress}
        style={styles.settingsContainer}
        showItemSeparator={false}
      />
    </>
  );

  return (
    <ScreenWrapper testID="GroupAdministration" isFullView>
      <Header
        title={name}
        titleTextProps={{color: theme.colors.textPrimary}}
        avatar={icon}
      />
      <View style={styles.container}>
        {renderGroupModerating()}
        <Divider style={styles.divider} />
        {renderGroupSettings()}
        <Divider />
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
      marginHorizontal: Platform.OS === 'web' ? spacing.margin.small : 0,
    },
    headerTitle: {
      marginHorizontal: spacing.margin.large,
    },
    divider: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
  });
};
