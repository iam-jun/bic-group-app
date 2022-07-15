import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import i18next from 'i18next';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
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
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;

  const ImportantStatusStyle = {
    active: {
      iconColor: colors.white,
      iconBackgroundColor: colors.purple50,
      textColor: colors.purple50,
      backgroundColor: colors.purple5,
    },
    inactive: {
      iconColor: colors.white,
      iconBackgroundColor: colors.purple50,
      textColor: colors.purple50,
      backgroundColor: colors.white,
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
      borderBottomColor: theme.colors.neutral5,
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
