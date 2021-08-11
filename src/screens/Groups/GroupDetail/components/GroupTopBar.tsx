import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {useRootNavigation} from '~/hooks/navigation';
import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import useGroups from '~/hooks/groups';

const GroupTopBar = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {navigation} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const groupData = useGroups();
  const {groupDetail} = groupData || {};
  const {can_setting} = groupDetail || {};

  return (
    <View style={styles.container}>
      <Icon
        icon={'iconBack'}
        size={26}
        tintColor={theme.colors.iconTint}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.rightComponent}>
        <Icon
          icon={'iconSearch'}
          size={22}
          style={{marginRight: theme.spacing.margin.large}}
          tintColor={theme.colors.iconTint}
        />
        {can_setting && (
          <TouchableOpacity
            onPress={() => rootNavigation.navigate(groupStack.groupAdmin)}>
            <Icon
              icon={'iconShieldStar'}
              fill={theme.colors.iconTint}
              size={24}
              style={styles.iconShieldStar}
            />
          </TouchableOpacity>
        )}

        <Icon icon={'EllipsisH'} tintColor={theme.colors.iconTint} />
      </View>
    </View>
  );
};

export default GroupTopBar;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing?.margin.large,
      marginVertical: spacing?.margin.small,
    },
    rightComponent: {
      flexDirection: 'row',
    },
    iconShieldStar: {
      marginRight: spacing.margin.large,
    },
  });
};
