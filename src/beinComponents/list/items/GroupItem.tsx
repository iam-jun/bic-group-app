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
import Image from '~/beinComponents/Image';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {IAction} from '~/constants/commonActions';

export interface GroupItemProps extends IParsedGroup {
  uiLevel: number;
  checkbox: IAction;
  isCollapsing: boolean;
}

const GroupItem: React.FC<GroupItemProps> = ({
  id,
  name,
  userCount,
  parentId,
  parent,
  children,
  icon,
  uiLevel,
  checkbox,
  isCollapsing,
}: GroupItemProps) => {
  const theme: ITheme = useTheme();
  const {spacing, colors} = theme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const _onPressItem = () => {
    rootNavigation.navigate(groupStack.groupDetail, {id});
  };

  const renderLine = (uiLevel: number) => {
    return (
      <View
        style={{
          width: 2,
          height: '100%',
          backgroundColor: colors.borderDivider,
          marginHorizontal: spacing?.margin.base,
        }}
      />
    );
  };

  const renderToggle = () => {
    return (
      <View
        style={{
          width: 2,
          height: '100%',
          backgroundColor: colors.borderDivider,
          marginHorizontal: spacing?.margin.base,
          flexDirection: 'row',
        }}>
        <ButtonWrapper
          style={{
            marginLeft: -7,
            alignSelf: 'center',
            backgroundColor: colors.background,
            paddingVertical: spacing?.padding.tiny,
          }}>
          <Icon size={18} icon={isCollapsing ? 'AngleDown' : 'AngleRight'} />
        </ButtonWrapper>
      </View>
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
    <TouchableOpacity onPress={_onPressItem}>
      <View style={{flexDirection: 'row'}}>
        {renderUiLevelLines()}
        {renderToggle()}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: spacing?.padding.tiny,
          }}>
          <Avatar.Medium source={icon} />
          <View style={styles.textContainer}>
            <Text.H6 style={styles.textName} numberOfLines={2}>
              {name}
            </Text.H6>
            <View style={styles.row}>
              <Icon
                icon={'iconUserGroup'}
                size={16}
                tintColor={colors.textSecondary}
              />
              <Text.BodyS color={colors.textSecondary} style={styles.textInfo}>
                {userCount}
              </Text.BodyS>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    textContainer: {
      paddingHorizontal: spacing.padding.base,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
    },
    textName: {
      maxWidth: 200,
    },
    textInfo: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default GroupItem;
