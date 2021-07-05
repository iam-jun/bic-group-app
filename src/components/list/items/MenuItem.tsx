import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import Icon from '~/components/Icon';
import {IOption} from '~/interfaces/IOption';
import {spacing} from '~/theme';

const MenuItem: React.FC<IOption> = ({title, icon}) => {
  const theme: IObject<any> = useTheme();

  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <Icon icon={icon} label={title} />
    </View>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      padding: spacing.padding.base,
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.base,
    },
  });
};

export default MenuItem;
