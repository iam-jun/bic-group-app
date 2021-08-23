import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';

export interface NotificationTopBarProps {
  onPressMenu: any;
}

const NotificationTopBar: FC<NotificationTopBarProps> = ({
  onPressMenu,
}: NotificationTopBarProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {spacing} = theme;
  return (
    <View style={styles.container}>
      <View style={{flex: 1, marginLeft: spacing?.margin.base}}>
        <Text.H5>Notifications</Text.H5>
      </View>
      <View style={styles.rightComponent}>
        <Icon
          icon={'EllipsisH'}
          tintColor={theme.colors.iconTint}
          onPress={onPressMenu}
        />
      </View>
    </View>
  );
};

export default NotificationTopBar;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginHorizontal: spacing?.margin.large,
      marginVertical: spacing?.margin.small,
    },
    rightComponent: {
      flexDirection: 'row',
    },
  });
};
