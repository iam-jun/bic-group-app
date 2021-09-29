import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import {IMessage} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';

const SystemMessage: React.FC<IMessage> = ({text}: IMessage) => {
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
      paddingBottom: spacing.padding.small,
    },
    text: {
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
};

export default SystemMessage;
