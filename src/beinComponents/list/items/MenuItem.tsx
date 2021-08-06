import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IOption} from '~/interfaces/IOption';

const MenuItem: React.FC<IOption> = ({title, icon}: IOption) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <Icon icon={icon} label={title} labelStyle={styles.label} />
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: spacing.padding.base,
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.base,
      marginHorizontal: spacing.margin.large,
    },
    label: {
      marginStart: spacing.margin.extraLarge,
    },
  });
};

export default MenuItem;
