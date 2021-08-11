import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';
import useGroups from '~/hooks/groups';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

const GroupAdministration = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const groupData = useGroups();
  const {groupDetail} = groupData || {};
  const {name, icon} = groupDetail?.group || {};

  const onGroupAdminPress = () => {
    dispatch(
      modalActions.showAlert({
        title: 'Info',
        content:
          'Function has not been developed. Stay tuned for further releases 😀',
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: 'Got it',
      }),
    );
  };

  const goToGeneralInfo = () => rootNavigation.navigate(groupStack.generalInfo);

  const renderItem = (
    icon: IconType,
    title: string,
    onActionPress?: () => void,
    rightSubTitle?: string,
  ) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onActionPress}>
        <Icon
          icon={icon}
          tintColor={theme.colors.primary7}
          label={title}
          labelStyle={styles.label}
        />
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
        subTitle={name}
        subTitleTextProps={{color: theme.colors.textPrimary}}
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
          onGroupAdminPress,
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
        {renderItem(
          'Cog',
          'settings:title_general_information',
          goToGeneralInfo,
        )}
        {renderItem(
          'ChatBubbleUser',
          'settings:title_role_management',
          onGroupAdminPress,
        )}
        {renderItem(
          'UserCircle',
          'settings:title_membership_settings',
          onGroupAdminPress,
        )}
        {renderItem(
          'FileCopyAlt',
          'settings:title_post_settings',
          onGroupAdminPress,
        )}
        {renderItem(
          'WebGrid',
          'settings:title_module_settings',
          onGroupAdminPress,
        )}
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
      padding: spacing.padding.base,
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.base,
      justifyContent: 'space-between',
    },
    rightComponent: {
      flexDirection: 'row',
    },
    label: {
      marginStart: spacing.margin.extraLarge,
    },
    rightSubIcon: {
      marginLeft: spacing.margin.base,
    },
    groupModerating: {
      margin: spacing.margin.large,
    },
    groupSetting: {
      marginHorizontal: spacing.margin.large,
    },
    headerTitle: {
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
