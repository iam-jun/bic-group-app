import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IOption} from '~/interfaces/IOption';
import Text from '~/beinComponents/Text';
import Div from '~/beinComponents/Div';

const MenuItem: React.FC<IOption> = ({
  title,
  icon,
  rightSubTitle,
  rightSubIcon,
  subTitle,
}: IOption) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <Div className="button">
      <View style={styles.container}>
        <Icon icon={icon} size={24} />
        <View style={styles.titleContainer}>
          <Text.ButtonBase useI18n>{title}</Text.ButtonBase>
          {!!subTitle && (
            <Text.Subtitle numberOfLines={2} useI18n>
              {subTitle}
            </Text.Subtitle>
          )}
        </View>
        <View style={styles.rightComponent}>
          {!!rightSubTitle && (
            <Text.BodyS color={theme.colors.iconTint} useI18n>
              {rightSubTitle}
            </Text.BodyS>
          )}
          {!!rightSubIcon && (
            <Icon icon={rightSubIcon} style={styles.rightSubIcon} />
          )}
        </View>
      </View>
    </Div>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: spacing.padding.base,
      paddingHorizontal: spacing.padding.extraLarge,
      borderRadius: spacing.borderRadius.small,
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
      marginLeft: spacing.margin.large,
    },
    rightComponent: {
      flexDirection: 'row',
    },
    label: {},
    rightSubIcon: {
      marginLeft: spacing.margin.base,
    },
  });
};

export default MenuItem;
