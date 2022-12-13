import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IGroup, IParsedGroup } from '~/interfaces/IGroup';
import Icon from '~/baseComponents/Icon';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Checkbox from '~/baseComponents/Checkbox';
import { generateUniqueId } from '~/utils/generator';
import { useKeySelector } from '~/hooks/selector';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import mainStack from '~/router/navigator/MainStack/stack';
import { AvatarType } from '~/baseComponents/Avatar/AvatarComponent';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import { Button } from '~/baseComponents';

export interface GroupItemProps extends IParsedGroup {
  groupStyle?: StyleProp<ViewStyle>;
  testID?: string;
  uiLevel: number;
  isCollapsing: boolean;
  disableOnPressItem?: boolean;
  checkboxDisabled?: boolean;
  showPrivacy?: boolean;
  showPrivacyName?: boolean;
  showPrivacyAvatar?: boolean;
  disableHorizontal?: boolean;
  showInfo?: boolean;
  iconVariant?: AvatarType;
  nameLines?: number;
  menuIcon?: IconType;

  onPressItem?: (item: GroupItemProps) => void;
  onToggleItem?: (item: GroupItemProps) => void;
  onPressMenu?: (item: GroupItemProps) => void;
  onCheckedItem?: (item: GroupItemProps, isChecked: boolean) => void;
  renderExtraInfo?: (group: IGroup) => any;
}

const GroupItem: React.FC<GroupItemProps> = (props: GroupItemProps) => {
  const {
    groupStyle,

    id,
    communityId,
    name,
    icon,
    testID = 'group_item',

    childrenUiIds = [],
    isChecked = false,

    hide = false,
    uiLevel = -1,
    isCollapsing = false,
    disableOnPressItem,
    checkboxDisabled,
    privacy,
    showPrivacyAvatar = false,
    iconVariant = 'base',
    nameLines = 2,
    menuIcon = 'menu',
    onPressItem,
    onToggleItem,
    onPressMenu,
    onCheckedItem,
    renderExtraInfo,
  } = props;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  if (hide) {
    return null;
  }

  const privacyData = GroupPrivacyDetail[privacy] || {};
  const { icon: privacyIcon }: any = privacyData;

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

  const renderLine = (_uiLevel: number) => (
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
              tintColor={theme.colors.neutral20}
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
          <Avatar
            variant={iconVariant}
            source={icon}
            privacyIcon={!!showPrivacyAvatar ? privacyIcon : undefined}
          />
          <View style={styles.textContainer}>
            <Text.BodyMMedium
              style={styles.textName}
              color={theme.colors.neutral60}
              numberOfLines={nameLines}
            >
              {name}
            </Text.BodyMMedium>
            {_renderExtraInfo?.()}
          </View>
          {onCheckedItem && (
            <Checkbox
              testID="group_item.check_box"
              style={styles.checkbox}
              isChecked={isChecked}
              disabled={checkboxDisabled ? 'disabled' : undefined}
              onPress={_onCheckedItem}
            />
          )}
          {!!onPressMenu && (
            <View style={styles.btnMenu}>
              <Button.Raise
                icon={menuIcon}
                size="small"
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

const themeStyles = (theme: ExtendedTheme) => {
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
      width: '100%',
      justifyContent: 'center',
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
      paddingVertical: spacing?.padding.small,
    },
    avatarContainer: {
      width: dimension?.avatarSizes.medium,
      height: dimension?.avatarSizes.medium,
    },
    checkbox: { },
    iconSmall: {
      height: 16,
    },
    privacyTitle: {
      marginLeft: spacing.margin.tiny,
    },
    btnMenu: {
      marginRight: spacing.margin.tiny,
      justifyContent: 'center',
    },
  });
};

export default GroupItem;
