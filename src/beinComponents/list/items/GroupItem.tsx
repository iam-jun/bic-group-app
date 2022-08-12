import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IGroup, IParsedGroup } from '~/interfaces/IGroup';
import { IObject } from '~/interfaces/common';
import Icon from '~/beinComponents/Icon';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/beinComponents/Text';
import Avatar from '~/bicComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Checkbox from '~/bicComponents/Checkbox';
import { generateUniqueId } from '~/utils/generator';
import { useKeySelector } from '~/hooks/selector';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import mainStack from '~/router/navigator/MainStack/stack';
import { AvatarType } from '~/bicComponents/Avatar/AvatarComponent';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

export interface GroupItemProps extends IParsedGroup {
  groupStyle?: StyleProp<ViewStyle>;
  testID?: string;
  uiLevel: number;
  isCollapsing: boolean;
  onPressItem?: (item: GroupItemProps) => void;
  onToggleItem?: (item: GroupItemProps) => void;
  onPressMenu?: (item: GroupItemProps) => void;
  onCheckedItem?: (item: GroupItemProps, isChecked: boolean) => void;
  disableOnPressItem?: boolean;
  showPrivacy?: boolean;
  showPrivacyName?: boolean;
  showPrivacyAvatar?: boolean;
  disableHorizontal?: boolean;
  showInfo?: boolean;
  iconVariant?: AvatarType;
  nameLines?: number;
  menuIcon?: IconType;
  renderExtraInfo?: (group: IGroup) => any;
}

const GroupItem: React.FC<GroupItemProps> = (props: GroupItemProps) => {
  const {
    groupStyle,

    id,
    communityId,
    name,
    userCount,
    icon,
    testID = 'group_item',

    childrenUiIds = [],
    isChecked = false,

    hide = false,
    uiLevel = -1,
    isCollapsing = false,
    onPressItem,
    onToggleItem,
    onPressMenu,
    onCheckedItem,
    disableOnPressItem,
    privacy,
    showPrivacy = false,
    showPrivacyName = true,
    showPrivacyAvatar = false,
    showInfo = true,
    disableHorizontal,
    iconVariant = 'base',
    nameLines = 2,
    menuIcon = 'menu',
    renderExtraInfo,
  } = props;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  if (hide) {
    return null;
  }

  const privacyData = groupPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon, title: privacyTitle }: any = privacyData || {};

  const _onPressItem = () => {
    if (onPressItem) {
      onPressItem(props);
    } else if (communityId) {
      rootNavigation.navigate(mainStack.communityDetail, {
        communityId,
      });
    } else {
      rootNavigation.navigate(
        groupStack.groupDetail, {
          groupId: id,
          initial: true,
        },
      );
    }
  };

  const _onPressMenu = () => {
    onPressMenu?.(props);
  };

  const _onToggleItem = () => {
    onToggleItem?.(props);
  };

  const _onCheckedItem = (isChecked: boolean) => {
    onCheckedItem?.(props, isChecked);
  };

  const _renderExtraInfo = () => renderExtraInfo?.(props);

  const renderLine = (uiLevel: number) => (
    <View
      testID="group_item.ui_level"
      key={generateUniqueId()}
      style={[styles.line]}
    />
  );

  const renderToggle = () => {
    if (uiLevel < 0) {
      return null;
    }
    const hasChild = childrenUiIds.length > 0;

    return (
      <ButtonWrapper
        testID="group_item.button_wrapper"
        onPress={_onToggleItem}
        disabled={!hasChild}
        activeOpacity={1}
        hitSlop={{
          top: 10, bottom: 10, left: 10, right: 10,
        }}
        style={styles.toggleContainer}
      >
        {hasChild && (
          <View style={styles.toggleContent}>
            <Icon
              testID="group_item.button_wrapper.icon"
              size={14}
              icon={isCollapsing ? 'CirclePlus' : 'CircleMinus'}
            />
          </View>
        )}
      </ButtonWrapper>
    );
  };

  const renderUiLevelLines = () => {
    if (uiLevel > 0) {
      return Array.from(Array(uiLevel).keys()).map((item) => renderLine(item));
    }
    return null;
  };

  return (
    <TouchableOpacity
      testID="group_item.container"
      disabled={!isInternetReachable || disableOnPressItem}
      onPress={_onPressItem}
    >
      <View style={{ flexDirection: 'row' }} testID={testID}>
        {renderUiLevelLines()}
        {renderToggle()}
        <View style={[styles.itemContainer, groupStyle]}>
          <View>
            <View>
              <Avatar variant={iconVariant} source={icon} />
              {!!showPrivacyAvatar && (
              <View style={styles.privacyAvatar}>
                <Icon
                  icon={privacyIcon}
                  size={14}
                  tintColor={theme.colors.gray50}
                />
              </View>
              )}
            </View>
            {onCheckedItem && (
              <Checkbox
                testID="group_item.check_box"
                style={styles.checkbox}
                isChecked={isChecked}
                onPress={_onCheckedItem}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text.H5
              style={
                disableHorizontal ? styles.textName : styles.textNameHorizontal
              }
              numberOfLines={nameLines}
            >
              {name}
            </Text.H5>
            {showInfo && (
              <View style={styles.row}>
                {showPrivacy && (
                  <>
                    <Icon
                      style={styles.iconSmall}
                      icon={privacyIcon}
                      size={16}
                      tintColor={theme.colors.gray50}
                    />
                    {showPrivacyName && (
                      <Text.BodyS style={styles.privacyTitle} useI18n>
                        {privacyTitle}
                      </Text.BodyS>
                    )}
                    <Text.BodyS> ⬩ </Text.BodyS>
                  </>
                )}
                <Icon icon="UserGroup" size={16} tintColor={colors.gray50} />
                <Text.BodyS color={colors.gray50} style={styles.textInfo}>
                  {userCount}
                </Text.BodyS>
              </View>
            )}
            {_renderExtraInfo?.()}
          </View>
          {!!onPressMenu && (
            <View style={styles.btnMenu}>
              <Icon
                style={{ alignSelf: 'auto' }}
                icon={menuIcon}
                testID="group_item.button_menu"
                onPress={_onPressMenu}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const { colors } = theme;
  return StyleSheet.create({
    textContainer: {
      paddingHorizontal: spacing.padding.base,
      flex: 1,
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: {
      flex: 1,
      paddingTop: 2,
    },
    textNameHorizontal: {
      maxWidth: 200,
      paddingTop: 2,
    },
    textInfo: {
      marginHorizontal: spacing.margin.tiny,
    },
    line: {
      width: 1,
      height: '100%',
      backgroundColor: colors.neutral5,
      marginHorizontal: spacing?.margin.small,
    },
    toggleContainer: {
      width: 1,
      height: '100%',
      backgroundColor: colors.transparent,
      marginHorizontal: spacing?.margin.small,
      flexDirection: 'row',
    },
    toggleContent: {
      marginLeft: -6,
      alignSelf: 'center',
      backgroundColor: colors.white,
      paddingVertical: spacing?.padding.tiny,
    },
    itemContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: spacing.padding.small,
      paddingVertical: spacing?.padding.tiny,
    },
    avatarContainer: {
      width: dimension?.avatarSizes.medium,
      height: dimension?.avatarSizes.medium,
    },
    checkbox: { position: 'absolute', bottom: -3, right: -6 },
    iconSmall: {
      height: 16,
    },
    privacyTitle: {
      marginLeft: spacing.margin.tiny,
    },
    privacyAvatar: {
      width: 16,
      height: 16,
      position: 'absolute',
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.neutral,
      borderRadius: spacing.borderRadius.small,
    },
    btnMenu: { marginRight: 8 },
  });
};

export default GroupItem;
