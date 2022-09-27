import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Icon from '~/baseComponents/Icon';
import { IconType } from '~/resources/icons';
import Image from '~/beinComponents/Image';
import spacing from '~/theme/spacing';

interface EmptyScreenProps {
  icon?: IconType;
  title?: string;
  description?: string;
  size?: number;
  ButtonComponent?: any;
  source?: string;
}

const EmptyScreen = ({
  icon,
  source,
  title,
  description,
  size = 150,
  ButtonComponent,
}: EmptyScreenProps) => {
  const theme: ExtendedTheme = useTheme();

  return (
    <View testID="empty_screen" style={styles.container}>
      {!!icon && <Icon icon={icon} size={size} />}
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
