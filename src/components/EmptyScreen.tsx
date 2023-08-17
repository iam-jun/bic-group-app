import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';

import Icon from '~/baseComponents/Icon';
import Image from '~/components/Image';
import Text from '~/baseComponents/Text';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';

interface EmptyScreenProps {
  icon?: IconType;
  title?: string;
  description?: string;
  size?: number;
  ButtonComponent?: any;
  source?: string;
  iconStyle?: any;
  style?: StyleProp<ViewStyle>;
}

const EmptyScreen = ({
  icon,
  source,
  title,
  description,
  size = 150,
  ButtonComponent,
  iconStyle,
  style,
}: EmptyScreenProps) => {
  const theme: ExtendedTheme = useTheme();

  return (
    <View testID="empty_screen" style={[styles.container, style]}>
      {!!icon && <Icon icon={icon} size={size} style={iconStyle} />}
      {!!source && (
      <Image
        resizeMode="contain"
        style={styles.imgEmpty}
        source={source}
      />
      )}
      {!!title && (
        <Text.BodyMMedium color={theme.colors.neutral70} style={styles.text} useI18n>
          {title}
        </Text.BodyMMedium>
      )}
      {!!description && (
        <Text.BodyS color={theme.colors.neutral40} style={styles.text} useI18n>
          {description}
        </Text.BodyS>
      )}
      {ButtonComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: spacing.padding.extraLarge,
    paddingVertical: spacing.padding.extraLarge,
  },
  text: {
    textAlign: 'center',
    marginVertical: spacing.margin.small,
  },
  imgEmpty: {
    width: 150,
    aspectRatio: 1,
  },
});

export default EmptyScreen;
