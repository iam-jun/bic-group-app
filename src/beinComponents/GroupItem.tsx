import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';

import {IGroup} from '~/interfaces/IGroup';
import {IObject} from '~/interfaces/common';
import {Image, Text} from '~/components/index';
import Icon from '~/beinComponents/Icon';
import {grey2, grey5, grey9} from '~/theme/colors';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

interface GroupItemProps extends IGroup {
  level?: number;
}

const GroupItem: React.FC<GroupItemProps> = ({
  id,
  name,
  userCount,
  parentId,
  parent,
  children,
  type,
  icon,

  level,
}) => {
  const theme = useTheme();
  const {spacing}: IObject<any> = theme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const _onPressItem = () => {
    rootNavigation.navigate(groupStack.groupDetail, {id});
  };

  const renderLine = (level: number) => {
    return (
      <View
        style={{
          width: 1,
          height: '100%',
          backgroundColor: grey2,
          marginHorizontal: 20,
        }}
      />
    );
  };

  const renderLevelLines = () => {
    if (typeof level === 'number' && level > 0) {
      return Array.from(Array(level).keys()).map(item => renderLine(item));
    } else {
      return null;
    }
  };

  return (
    <TouchableOpacity onPress={_onPressItem}>
      <View style={{flexDirection: 'row'}}>
        {renderLevelLines()}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: spacing.padding.tiny,
          }}>
          <Image style={styles.icon} source={{uri: icon}} />
          <View style={styles.textContainer}>
            <Text bold h5 style={styles.textName} numberOfLines={2}>
              {name}
            </Text>
            <View style={styles.row}>
              <Icon icon={'iconUserGroup'} size={16} tintColor={grey5} />
              <Text style={styles.textInfo} h5 colorThird>
                {userCount}
              </Text>
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
    icon: {
      width: 48,
      height: 48,
      borderRadius: spacing.borderRadius.small,
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
