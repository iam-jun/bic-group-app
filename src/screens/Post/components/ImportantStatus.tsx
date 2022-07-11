import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';

export interface ImportantStatusProps {
  notExpired: boolean;
  textProps?: TextProps;
  style?: StyleProp<ViewStyle>;
}

const ImportantStatus: FC<ImportantStatusProps> = ({
  notExpired,
  textProps,
  style,
}: ImportantStatusProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  const ImportantStatusStyle = {
    active: {
      iconColor: colors.background,
      iconBackgroundColor: colors.primary6,
      textColor: colors.primary6,
      backgroundColor: colors.primary2,
    },
    inactive: {
      iconColor: colors.iconTintReversed,
      iconBackgroundColor: colors.primary6,
      textColor: colors.primary6,
      backgroundColor: colors.background,
    },
  };

  const {iconColor, iconBackgroundColor, textColor, backgroundColor} =
    notExpired
      ? ImportantStatusStyle['active']
      : ImportantStatusStyle['inactive'];

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flexDirection: 'row',
      backgroundColor: backgroundColor,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.placeholder,
    },
    style,
  ]);

  return (
    <View style={containerStyle} testID="important_status">
      <Icon
        isButton
        iconStyle={[styles.iconStyle, {backgroundColor: iconBackgroundColor}]}
        style={styles.leftIcon}
        size={14}
        icon={'iconStar'}
        tintColor={iconColor}
      />
      <View style={styles.textContainer}>
        <Text.H6
          testID={
            notExpired ? 'important_status_active' : 'important_status_expire'
          }
          {...textProps}
          color={textColor}>
          {i18next.t('common:text_important')}
        </Text.H6>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing.margin.small,
  },
  iconStyle: {padding: 3, borderRadius: 6},
});

export default ImportantStatus;
