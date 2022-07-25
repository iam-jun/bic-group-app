import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';

interface EmptyScreenProps {
  source?: IconType;
  title?: string;
  description?: string;
  size?: number;
  ButtonComponent?: any;
}

const EmptyScreen = ({
  source,
  title,
  description,
  size = 150,
  ButtonComponent,
}: EmptyScreenProps) => {
  const theme: ExtendedTheme = useTheme();

  return (
    <View testID="empty_screen" style={styles.container}>
      {!!source && <Icon icon={source} size={size} />}
      {!!title && (
        <Text.ButtonM style={styles.text} useI18n>
          {title}
        </Text.ButtonM>
      )}
      {!!description && (
        <Text.BodyS color={theme.colors.gray50} style={styles.text} useI18n>
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
  },
  text: {
    textAlign: 'center',
    marginVertical: spacing.margin.tiny,
  },
});

export default EmptyScreen;
