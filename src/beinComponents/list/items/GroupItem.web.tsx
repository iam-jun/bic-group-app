import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {IParsedGroup} from '~/interfaces/IGroup';
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

export interface GroupItemProps extends IParsedGroup {
  uiLevel: number;
  isCollapsing: boolean;
  onPressItem?: (item: GroupItemProps) => void;
  onToggleItem?: (item: GroupItemProps) => void;
  onCheckedItem?: (item: GroupItemProps, isChecked: boolean) => void;
  disableOnPressItem?: boolean;
}

const GroupItem: React.FC<GroupItemProps> = (props: GroupItemProps) => {
  const {
    id,
    name,
    user_count,
    icon,

    childrenUiIds = [],
    isChecked = false,

    hide = false,
    uiLevel = -1,
    isCollapsing = false,
    onPressItem,
    onToggleItem,
    onCheckedItem,
    disableOnPressItem,
  } = props;

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  if (hide) {
    return null;
  }

  const _onPressItem = () => {
    if (onPressItem) {
      onPressItem(props);
    } else {
      rootNavigation.navigate(groupStack.groupDetail, {
        groupId: id,
        initial: true,
      });
    }
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

  const renderLine = (uiLevel: number) => {
    return <View key={generateUniqueId()} style={styles.line} />;
  };

  const renderToggle = () => {
    if (uiLevel < 0) {
      return null;
    }
    const hasChild = childrenUiIds.length > 0;

    return (
      <ButtonWrapper
        onPress={_onToggleItem}
        disabled={!hasChild}
        activeOpacity={1}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={styles.toggleContainer}>
        {hasChild && (
          <View style={styles.toggleContent}>
            <Icon size={18} icon={isCollapsing ? 'AngleRight' : 'AngleDown'} />
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
    <TouchableOpacity disabled={disableOnPressItem} onPress={_onPressItem}>
      <View style={{flexDirection: 'row'}}>
        {renderUiLevelLines()}
        {renderToggle()}
        <View style={styles.itemContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Medium source={icon} />
            {onCheckedItem && (
              <Checkbox
                style={styles.checkbox}
                isChecked={isChecked}
                onActionPress={_onCheckedItem}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text.H6 style={styles.textName} numberOfLines={2}>
              {name}
            </Text.H6>
            <View style={styles.row}>
              <Icon icon="users" size={16} tintColor={colors.textSecondary} />
              <Text.BodyS color={colors.textSecondary} style={styles.textInfo}>
                {user_count}
              </Text.BodyS>
            </View>
          </View>
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
      maxWidth: 200,
      paddingTop: 2,
    },
    textInfo: {
      marginHorizontal: spacing.margin.tiny,
    },
    line: {
      width: 2,
      height: '100%',
      backgroundColor: colors.borderDivider,
      marginHorizontal: spacing?.margin.base,
    },
    toggleContainer: {
      width: 2,
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
  });
};

export default GroupItem;
