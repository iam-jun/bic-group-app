import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import {ISystemMessage} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';

const SystemMessage: React.FC<ISystemMessage> = ({
  text,
  msg,
}: ISystemMessage) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const content = text?.replace(msg, '');

  return (
    <Text.BodyS style={styles.container}>
      <Text.BodyS style={styles.name}>{msg}</Text.BodyS>
      {content}
    </Text.BodyS>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.small,
      color: colors.textSecondary,
    },
    name: {
      fontWeight: '700',
    },
  });
};

export default SystemMessage;
