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
import Icon from '~/beinComponents/Icon';
import ListView from '~/beinComponents/list/ListView';
import {groupSettings} from '~/constants/groupAdminSettings';

const GroupAdministration = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {name, icon} = useKeySelector(groupsKeySelector.groupDetail.group);

  useEffect(() => {
    // in case for refreshing page on web
    Platform.OS === 'web' && dispatch(groupsActions.getGroupDetail(groupId));
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

  const goToGeneralInfo = () =>
    rootNavigation.navigate(groupStack.generalInfo, {groupId});

  const renderItem = (
    icon: IconType,
    title: string,
    onActionPress?: () => void,
    rightSubTitle?: string,
  ) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onActionPress}>
        <Icon icon={icon} tintColor={theme.colors.primary7} size={24} />
        <View style={styles.titleContainer}>
          <Text.ButtonBase useI18n style={styles.label}>
            {title}
          </Text.ButtonBase>
        </View>

        <View style={styles.rightComponent}>
          {!!rightSubTitle && (
            <View style={styles.rightSubtitle}>
              <Text.BodyS color={theme.colors.background} useI18n>
                {rightSubTitle}
              </Text.BodyS>
            </View>
          )}
          <Icon icon={'AngleRightB'} style={styles.rightSubIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      testID="GroupAdministration"
      style={styles.container}
      isFullView>
      <Header
        title={name}
        titleTextProps={{color: theme.colors.textPrimary}}
        avatar={icon}
      />

      <View style={styles.groupModerating}>
        <Text.H5
          style={styles.headerTitle}
          color={theme.colors.textSecondary}
          useI18n>
          settings:title_group_moderating
        </Text.H5>
        {renderItem(
          'UserExclamation',
          'settings:title_pending_members',
          displayNewFeature,
          '1',
        )}
      </View>

      <View style={styles.groupSetting}>
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
      </View>

      <Divider />
    </ScreenWrapper>
  );
};

export default GroupAdministration;

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {},
    itemContainer: {
      flexDirection: 'row',
      // padding: spacing.padding.,
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.base,
    },
    rightComponent: {
      flexDirection: 'row',
    },
    titleContainer: {
      flex: 1,
      marginLeft: spacing.margin.large,
    },
    label: {},
    rightSubIcon: {
      marginLeft: spacing.margin.base,
    },
    groupModerating: {
      marginVertical: spacing.margin.large,
    },
    groupSetting: {},
    settingsContainer: {
      marginHorizontal: Platform.OS === 'web' ? spacing.margin.small : 0,
    },
    headerTitle: {
      marginHorizontal: spacing.margin.large,
      marginBottom: spacing.margin.small,
    },
    rightSubtitle: {
      backgroundColor: colors.error,
      paddingVertical: 2,
      paddingHorizontal: 6.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
  });
};
