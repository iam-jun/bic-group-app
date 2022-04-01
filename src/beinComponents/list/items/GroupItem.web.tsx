import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
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
import Div from '~/beinComponents/Div';
import {useKeySelector} from '~/hooks/selector';
import appActions from '~/store/app/actions';
import {appScreens} from '~/configs/navigator';

export interface GroupItemProps extends IParsedGroup {
  testID?: string;
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
    testID = 'group_item',

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

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const rootScreenName = useKeySelector('app.rootScreenName') || '';
  const [currentAccessingGroup, setCurrentShowingGroup] = useState<any>();
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // If accessing group, path will be 'groups/{id}'
    const paths = rootScreenName.split('/');

    if (paths[0] !== appScreens.groups) setCurrentShowingGroup(undefined);

    setCurrentShowingGroup(paths[1]);
  }, [rootScreenName]);

  useEffect(() => {
    if (!currentAccessingGroup) {
      setIsActive(false);
      return;
    }

    // Don't have to use strict equality, as currentAccessingGroup might not number
    currentAccessingGroup == id ? setIsActive(true) : setIsActive(false);
  }, [currentAccessingGroup]);

  let className = 'group-item';
  if (isActive) className = className + ` ${className}--active`;

  if (hide) {
    return null;
  }

  const _onPressItem = () => {
    const newRootScreenName = `${appScreens.groups}/${id}`;
    dispatch(appActions.setRootScreenName(newRootScreenName));

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
    return <Div key={generateUniqueId()} className="group-item__line" />;
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
          <Div className="group-item__toggle">
            <View style={styles.toggleContent}>
              <Icon
                size={18}
                icon={isCollapsing ? 'AngleRight' : 'AngleDown'}
              />
            </View>
          </Div>
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
    <Div className={className}>
      <TouchableOpacity
        disabled={!isInternetReachable || disableOnPressItem}
        onPress={_onPressItem}>
        <View style={styles.container} testID={testID}>
          {Platform.OS === 'web' && isActive && (
            <View style={styles.itemActiveIndicator} />
          )}
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
                <Text.BodyS
                  color={colors.textSecondary}
                  style={styles.textInfo}>
                  {user_count}
                </Text.BodyS>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Div>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {spacing, colors, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      minHeight: 46,
      width: 286,
    },
    textContainer: {
      paddingHorizontal: spacing.padding.base,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemActiveIndicator: {
      width: 4,
      height: 32,
      position: 'absolute',
      marginTop: 7,
      backgroundColor: colors.primary5,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    textName: {
      maxWidth: 200,
      paddingTop: 2,
    },
    textInfo: {
      marginHorizontal: spacing.margin.tiny,
    },
    toggleContainer: {
      width: 2,
      height: '100%',
      marginHorizontal: spacing?.margin.base,
      flexDirection: 'row',
    },
    toggleContent: {
      marginLeft: -7,
      alignSelf: 'center',
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
