import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';

interface EmptyScreenProps {
  source: IconType;
  title: string;
  description: string;
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
  const styles = themeStyles(theme);

  return (
    <View testID="empty_screen" style={styles.container}>
      <Icon icon={source} size={size} />
      <Text.ButtonBase style={styles.text} useI18n>
        {title}
      </Text.ButtonBase>
      <Text.Subtitle
        color={theme.colors.textSecondary}
        style={styles.text}
        useI18n>
        {description}
      </Text.Subtitle>
      {ButtonComponent}
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
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
};

export default EmptyScreen;
