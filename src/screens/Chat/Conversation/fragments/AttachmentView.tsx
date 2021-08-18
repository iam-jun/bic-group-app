import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import {Text} from '~/components';
import {messageStatus} from '~/constants/chat';
import {IMessage} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';
import {formatBytes} from '~/utils/formatData';

const AttachmentView: React.FC<IMessage> = (props: IMessage) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {attachment, status} = props;
  const {name, size} = attachment || {};

  const color =
    status === messageStatus.FAILED ? theme.colors.error : theme.colors.text;

  const colorSecondary =
    status === messageStatus.FAILED
      ? theme.colors.error
      : theme.colors.textSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {status === messageStatus.SENDING ? (
          <ActivityIndicator size="large" />
        ) : (
          <Icon icon="File" size={36} tintColor={theme.colors.primary} />
        )}
      </View>
      <View>
        <Text.Body numberOfLines={2} style={styles.title} color={color}>
          {name}
        </Text.Body>
        <View style={styles.metadata}>
          <Text.BodyS color={colorSecondary}>
            {formatBytes(size || 0)}
          </Text.BodyS>
          {status !== messageStatus.FAILED && (
            <View style={[styles.dot, {backgroundColor: colorSecondary}]} />
          )}
          {status === messageStatus.SENDING && (
            <Text.BodyS useI18n>{`chat:upload_status:${status}`}</Text.BodyS>
          )}
          {status === messageStatus.SENT && (
            <Text.BodySM useI18n>common:text_download</Text.BodySM>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: 39,
      paddingRight: spacing.padding.big,
      paddingVertical: spacing.padding.base,
    },
    left: {
      marginHorizontal: spacing.margin.tiny,
    },
    title: {
      flexShrink: 1,
    },
    metadata: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.tiny,
    },
    dot: {
      width: 2,
      height: 2,
      marginHorizontal: spacing.margin.small,
      backgroundColor: colors.textSecondary,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default AttachmentView;
