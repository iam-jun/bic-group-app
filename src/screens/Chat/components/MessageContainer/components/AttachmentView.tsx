import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import ImageViewer from '~/beinComponents/Image/ImageViewer';
import Video from '~/beinComponents/Video';
import Text from '~/beinComponents/Text';
import {messageStatus} from '~/constants/chat';
import {IMessage} from '~/interfaces/IChat';
import {scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {openLink, parseSafe} from '~/utils/common';
import {formatBytes} from '~/utils/formatData';
import {getDownloadUrl, getMessageAttachmentUrl} from '../../../helper';

interface AttachmentViewProps extends IMessage {
  attachmentMedia?: any;
  onLongPress?: (e: any) => void;
}

const AttachmentView: React.FC<AttachmentViewProps> = (
  props: AttachmentViewProps,
) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyles(theme);
  const {attachment, status, attachmentMedia, onLongPress} = props;
  const {name, size} = attachment || {};

  const desc = attachment?.description || '';
  const descObj = parseSafe(desc);

  if (!attachment || descObj?.type === 'reply') return null;

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
        let initIndex;
        if (attachmentMedia?.length > 0) {
          for (let i = 0; i < attachmentMedia.length; i++) {
            if (attachmentMedia?.[i]?.title === attachment?.title) {
              initIndex = i;
              break;
            }
          }
        }
        const target = attachmentMedia?.[initIndex || 0] || attachment;
        const {width, height} = calculateImgSize(target?.width, target?.height);
        return (
          <ImageViewer
            style={{
              width,
              height,
              backgroundColor: colors.placeholder,
              borderRadius: spacing.borderRadius.small,
            }}
            resizeMode={'contain'}
            source={initIndex !== undefined ? attachmentMedia : url}
            initIndex={initIndex}
            onLongPress={onLongPress}
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
        <View style={styles.metaView}>
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

const calculateImgSize = (oW: number, oH: number) => {
  const dW = Platform.OS === 'web' ? 300 : scaleSize(307);
  const dH = Platform.OS === 'web' ? 200 : scaleSize(307);
  if (!oW || !oH) {
    return {width: dW, height: dH};
  }
  let width = dW;
  let height = (width * oH) / oW;
  if (height > dH) {
    height = dH;
    width = (height * oW) / oH;
  }
  return {width, height};
};

const createStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.padding.base,
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
    metaView: {
      flex: 1,
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
