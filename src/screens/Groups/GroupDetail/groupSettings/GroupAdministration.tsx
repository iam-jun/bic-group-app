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
    rootNavigation.navigate(groupStack.groupPendingMembers, {groupId});
  };

  const goToGeneralInfo = () => {
    rootNavigation.navigate(groupStack.generalInfo, {groupId});
  };

  const renderGroupSettingItem = ({item, index}: any) => {
    if (!item) return null;
    const {title = '', icon = '', rightSubIcon = ''} = item;
    return (
      <MenuItem
        testID={`group_administration.settings.item.${index}`}
        title={title}
        icon={icon}
        iconProps={{icon: icon, tintColor: theme.colors.primary6}}
        rightSubIcon={rightSubIcon}
        onPress={() => {
          onGroupAdminPress(item);
        }}
      />
    );
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
        rightSubIcon="AngleRightB"
        onPress={onPress}
      />
    );
  };

  const renderGroupModerating = () => (
    <>
      <Text.H5
        style={styles.headerTitle}
        color={theme.colors.textPrimary}
        variant="body"
        useI18n>
        settings:title_group_moderating
      </Text.H5>
      {renderItem(
        'UserExclamation',
        'settings:title_pending_members',
        goToPendingMembers,
        totalPendingMembers,
        'group_administration.pending_members',
      )}
      {renderItem(
        'FileExclamationAlt',
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
        variant="body"
        useI18n>
        settings:title_group_settings
      </Text.H5>
      <ListView
        data={groupSettings}
        renderItem={renderGroupSettingItem}
        scrollEnabled={false}
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
      marginHorizontal: Platform.OS === 'web' ? spacing.margin.small : 0,
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
