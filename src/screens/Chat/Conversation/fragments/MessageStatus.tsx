import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {IMesssageStatus} from '~/interfaces/IChat';
import {Text} from '~/components';
import i18next from 'i18next';

export interface Props {
  status?: IMesssageStatus;
  onRetryPress: () => void;
}

const MessageStatus: React.FC<Props> = ({
  status,
  onRetryPress,
}: Props): React.ReactElement | null => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  if (!status || status !== 'failed') return null;

  return (
    <View style={styles.container}>
      <Text.Subtitle color={theme.colors.error}>
        {i18next.t(`chat:message_status:${status}`)}
      </Text.Subtitle>
      <View style={styles.dot} />
      <Text.ButtonSmall style={styles.retry} onPress={onRetryPress}>
        {i18next.t('common:text_retry')}
      </Text.ButtonSmall>
    </View>
  );
};
const createStyles = (theme: ITheme) => {
  const {colors, dimension, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.base,
      marginStart:
        (dimension?.avatarSizes.medium || 36) + (spacing.margin.small || 8),
    },
    dot: {
      width: 4,
      height: 4,
      backgroundColor: colors.error,
      borderRadius: 100,
      marginHorizontal: spacing.margin.small,
    },
    retry: {
      color: colors.error,
      textDecorationLine: 'underline',
    },
  });
};

export default MessageStatus;
