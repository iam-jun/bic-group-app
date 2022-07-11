import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';
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
  const theme = useTheme() as ITheme;

  return (
    <View testID="empty_screen" style={styles.container}>
      {!!source && <Icon icon={source} size={size} />}
      {!!title && (
        <Text.ButtonBase style={styles.text} useI18n>
          {title}
        </Text.ButtonBase>
      )}
      {!!description && (
        <Text.Subtitle
          color={theme.colors.textSecondary}
          style={styles.text}
          useI18n>
          {description}
        </Text.Subtitle>
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
