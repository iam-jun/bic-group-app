import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {IGroup, IParsedGroup} from '~/interfaces/IGroup';
import {IObject} from '~/interfaces/common';
import Icon from '~/beinComponents/Icon';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Checkbox from '~/beinComponents/SelectionControl/Checkbox';
import commonActions, {IAction} from '~/constants/commonActions';
import {generateUniqueId} from '~/utils/generator';
import {useKeySelector} from '~/hooks/selector';
import privacyTypes from '~/constants/privacyTypes';
import mainStack from '~/router/navigator/MainStack/stack';
import {AvatarType} from '~/beinComponents/Avatar/AvatarComponent';
import {IconType} from '~/resources/icons';

export interface GroupItemProps extends IParsedGroup {
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
  disableHorizontal?: boolean;
  showInfo?: boolean;
  iconVariant?: AvatarType;
  nameLines?: number;
  menuIcon?: IconType;
  renderExtraInfo?: (group: IGroup) => any;
}

const GroupItem: React.FC<GroupItemProps> = (props: GroupItemProps) => {
  const {
    id,
    community_id,
    name,
    user_count,
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
    showInfo = true,
    disableHorizontal,
    iconVariant = 'medium',
    nameLines = 2,
    menuIcon = 'menu',
    renderExtraInfo,
  } = props;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  if (hide) {
    return null;
  }

  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

  const _onPressItem = () => {
    if (onPressItem) {
      onPressItem(props);
    } else {
      if (community_id) {
        rootNavigation.navigate(mainStack.communityDetail, {
          communityId: community_id,
        });
      } else {
        rootNavigation.navigate(groupStack.groupDetail, {
          groupId: id,
          initial: true,
        });
      }
    }
  };

  const _onPressMenu = () => {
    onPressMenu?.(props);
  };

  const _onToggleItem = () => {
    onToggleItem?.(props);
  };

  const _onCheckedItem = (action: IAction) => {
    let newChecked = false;
    if (action === commonActions.checkBox) {
      newChecked = true;
    }
    onCheckedItem?.(props, newChecked);
  };

  const _renderExtraInfo = () => {
    return renderExtraInfo?.(props);
  };

  const renderLine = (uiLevel: number) => {
    return (
      <View
        testID="group_item.ui_level"
        key={generateUniqueId()}
        style={styles.line}
      />
    );
  };

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
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={styles.toggleContainer}>
        {hasChild && (
          <View style={styles.toggleContent}>
            <Icon
              testID="group_item.button_wrapper.icon"
              size={18}
              icon={isCollapsing ? 'AngleRight' : 'AngleDown'}
            />
          </View>
        )}
      </ButtonWrapper>
    );
  };

  const renderUiLevelLines = () => {
    if (uiLevel > 0) {
      return Array.from(Array(uiLevel).keys()).map(item => renderLine(item));
    } else {
      return null;
    }
  };

  return (
    <TouchableOpacity
      testID="group_item.container"
      disabled={!isInternetReachable || disableOnPressItem}
      onPress={_onPressItem}>
      <View style={{flexDirection: 'row'}} testID={testID}>
        {renderUiLevelLines()}
        {renderToggle()}
        <View style={styles.itemContainer}>
          <View>
            <Avatar variant={iconVariant} source={icon} />
            {onCheckedItem && (
              <Checkbox
                testID="group_item.check_box"
                style={styles.checkbox}
                isChecked={isChecked}
                onActionPress={_onCheckedItem}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text.H6
              style={
                disableHorizontal ? styles.textName : styles.textNameHorizontal
              }
              numberOfLines={nameLines}>
              {name}
            </Text.H6>
            {showInfo && (
              <View style={styles.row}>
                {showPrivacy && (
                  <>
                    <Icon
                      style={styles.iconSmall}
                      icon={privacyIcon}
                      size={16}
                      tintColor={theme.colors.textSecondary}
                    />
                    {showPrivacyName && (
                      <Text.BodyS style={styles.privacyTitle} useI18n>
                        {privacyTitle}
                      </Text.BodyS>
                    )}
                    <Text.BodyS> ⬩ </Text.BodyS>
                  </>
                )}
                <Icon
                  icon={'UserGroup'}
                  size={16}
                  tintColor={colors.textSecondary}
                />
                <Text.BodyS
                  color={colors.textSecondary}
                  style={styles.textInfo}>
                  {user_count}
                </Text.BodyS>
              </View>
            )}
            {_renderExtraInfo?.()}
          </View>
          {!!onPressMenu && (
            <View style={styles.btnMenu}>
              <Icon
                style={{alignSelf: 'auto'}}
                icon={menuIcon}
                testID={'group_item.button_menu'}
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
  const {spacing, colors, dimension} = theme;
  return StyleSheet.create({
    textContainer: {
      paddingHorizontal: spacing.padding.base,
      flex: 1,
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
      backgroundColor: colors.borderDivider,
      marginHorizontal: spacing?.margin.base,
    },
    toggleContainer: {
      width: 1,
      height: '100%',
      backgroundColor: colors.borderDivider,
      marginHorizontal: spacing?.margin.base,
      flexDirection: 'row',
    },
    toggleContent: {
      marginLeft: -7,
      alignSelf: 'center',
      backgroundColor: colors.background,
      paddingVertical: spacing?.padding.tiny,
    },
    itemContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: spacing?.padding.tiny,
    },
    avatarContainer: {
      width: dimension?.avatarSizes.medium,
      height: dimension?.avatarSizes.medium,
    },
    checkbox: {position: 'absolute', bottom: -3, right: -6},
    iconSmall: {
      height: 16,
    },
    privacyTitle: {
      marginLeft: spacing.margin.tiny,
    },
    btnMenu: {marginRight: 8},
  });
};

export default GroupItem;
