import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Text} from '~/components';
import {GMessage} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';

const SystemMessage: React.FC<GMessage> = ({text}: GMessage) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text.BodyS style={styles.text}>{text}</Text.BodyS>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: spacing.padding.big,
      paddingBottom: spacing.padding.big,
    },
    text: {
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
};

export default SystemMessage;
