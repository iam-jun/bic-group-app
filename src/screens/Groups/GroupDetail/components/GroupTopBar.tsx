import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {useRootNavigation} from '~/hooks/navigation';
import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

const GroupTopBar = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {navigation} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  return (
    <View style={styles.container}>
      <Icon
        icon={'iconBack'}
        size={26}
        tintColor={theme.colors.iconTint}
        onPress={() => navigation.goBack()}
      />
      <View style={{flexDirection: 'row'}}>
        <Icon
          icon={'iconSearch'}
          size={22}
          style={{marginRight: theme.spacing.margin.large}}
          tintColor={theme.colors.iconTint}
        />
        <TouchableOpacity
          onPress={() => rootNavigation.navigate(groupStack.groupAdmin)}>
          <Icon
            icon={'iconShieldStar'}
            fill={theme.colors.iconTint}
            size={24}
            style={{marginRight: theme.spacing.margin.large}}
          />
        </TouchableOpacity>
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
  });
};
