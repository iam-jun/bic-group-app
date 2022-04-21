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
  onPress?: () => void;
  buttonTitle?: string;
}

const EmptyScreen = ({
  source,
  title,
  description,
  onPress,
  buttonTitle,
}: EmptyScreenProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <Icon icon={source} size={150} />
      <Text.ButtonBase style={styles.text} useI18n>
        {title}
      </Text.ButtonBase>
      <Text.Subtitle
        color={theme.colors.textSecondary}
        style={styles.text}
        useI18n>
        {description}
      </Text.Subtitle>
      {!!onPress && !!buttonTitle && (
        <ButtonWrapper onPress={onPress} style={styles.buttonWrapper}>
          <Text.ButtonBase useI18n color={theme.colors.bgButtonPrimary}>
            {buttonTitle}
          </Text.ButtonBase>
        </ButtonWrapper>
      )}
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
    buttonWrapper: {
      marginTop: spacing.margin.large,
    },
  });
};

export default EmptyScreen;
