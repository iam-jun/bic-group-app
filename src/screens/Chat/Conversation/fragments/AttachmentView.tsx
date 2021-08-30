import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import ImageViewer from '~/beinComponents/Image/ImageViewer';
import Video from '~/beinComponents/Video';
import {Text} from '~/components';
import {messageStatus} from '~/constants/chat';
import {IMessage} from '~/interfaces/IChat';
import {scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {openLink} from '~/utils/common';
import {formatBytes} from '~/utils/formatData';
import {getDownloadUrl, getMessageAttachmentUrl} from '../../helper';

const AttachmentView: React.FC<IMessage> = (props: IMessage) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {attachment, status} = props;
  const {name, size} = attachment || {};

  if (!attachment) return null;

  const color =
    status === messageStatus.FAILED ? theme.colors.error : theme.colors.text;

  const colorSecondary =
    status === messageStatus.FAILED
      ? theme.colors.error
      : theme.colors.textSecondary;

  const renderAttachment = () => {
    if (status === messageStatus.SENT) {
      if (attachment?.image_url) {
        const url = getMessageAttachmentUrl(attachment?.image_url);

        return (
          <ImageViewer
            style={styles.image}
            resizeMode="cover"
            source={{uri: url}}
          />
        );
      } else if (attachment?.video_url) {
        const url = getMessageAttachmentUrl(attachment?.video_url);

        return <Video source={{uri: url}} />;
      }
    }

    const dowloadFile = () => {
      const url = getDownloadUrl(attachment?.title_link);

      openLink(url);
    };

    return (
      <View style={styles.defaultFileContainer}>
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
              <Text.BodySM useI18n onPress={dowloadFile}>
                common:text_download
              </Text.BodySM>
            )}
          </View>
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{renderAttachment()}</View>;
};

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 52,
      paddingVertical: spacing.padding.base,
    },
    image: {
      width: Platform.OS === 'web' ? 300 : scaleSize(307),
      height: Platform.OS === 'web' ? 200 : scaleSize(225.5),
      backgroundColor: colors.placeholder,
    },
    defaultFileContainer: {
      flexDirection: 'row',
    },
    left: {
      marginRight: spacing.margin.tiny,
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
