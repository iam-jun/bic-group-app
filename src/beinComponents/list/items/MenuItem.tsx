import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IOption} from '~/interfaces/IOption';
import Text from '~/beinComponents/Text';

const MenuItem: React.FC<IOption> = ({
  title,
  icon,
  rightSubTitle,
  rightSubIcon,
}: IOption) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <Icon icon={icon} label={title} labelStyle={styles.label} />
      <View style={styles.rightComponent}>
        {rightSubTitle && (
          <Text.BodyS color={theme.colors.iconTint}>{rightSubTitle}</Text.BodyS>
        )}
        {rightSubIcon && (
          <Icon icon={rightSubIcon} style={styles.rightSubIcon} />
        )}
      </View>
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
      justifyContent: 'space-between',
    },
    rightComponent: {
      flexDirection: 'row',
    },
    label: {
      marginStart: spacing.margin.extraLarge,
    },
    rightSubIcon: {
      marginLeft: spacing.margin.base,
    },
  });
};

export default MenuItem;
