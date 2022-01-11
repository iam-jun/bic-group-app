import React from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '~/beinComponents/Text';
import ImageAddUsers from '~/../assets/images/img_add_users.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

interface EmptyScreenProps {
  title: string;
  description: string;
}

const EmptyScreen = ({title, description}: EmptyScreenProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <SvgIcon source={ImageAddUsers} width={150} height={150} />
      <Text.ButtonBase style={styles.text} useI18n>
        {title}
      </Text.ButtonBase>
      <Text.Subtitle
        color={theme.colors.textSecondary}
        style={styles.text}
        useI18n>
        {description}
      </Text.Subtitle>
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
