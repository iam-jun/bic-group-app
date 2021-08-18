import React, {useRef, useState} from 'react';
import {createRef} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Video from 'react-native-video';
import Icon from '~/beinComponents/Icon';
import {Image, Text} from '~/components';
import {messageStatus} from '~/constants/chat';
import {IMessage} from '~/interfaces/IChat';
import {scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {formatBytes} from '~/utils/formatData';
import {getMessageAttachmentUrl} from '../../helper';

const AttachmentView: React.FC<IMessage> = (props: IMessage) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {attachment, status} = props;
  const {name, size} = attachment || {};
  const videoRef = createRef<Video>();
  const [videoPaused, setVideoPaused] = useState(true);

  const color =
    status === messageStatus.FAILED ? theme.colors.error : theme.colors.text;

  const colorSecondary =
    status === messageStatus.FAILED
      ? theme.colors.error
      : theme.colors.textSecondary;

  const playVideo = () => {
    videoRef.current?.presentFullscreenPlayer();
    setVideoPaused(false);
  };

  const renderAttachment = () => {
    if (status === messageStatus.SENT) {
      if (attachment?.image_url) {
        const url = getMessageAttachmentUrl(attachment?.image_url);

        return (
          <Image style={styles.image} resizeMode="cover" source={{uri: url}} />
        );
      } else if (attachment?.video_url) {
        const url = getMessageAttachmentUrl(attachment?.video_url);

        return (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              style={styles.video}
              paused={videoPaused}
              source={{uri: url}}
              onFullscreenPlayerDidDismiss={() => setVideoPaused(true)}
            />
            <Icon
              style={styles.iconPlay}
              size={36}
              icon="PlayVideo"
              onPress={playVideo}
            />
          </View>
        );
      }
    }

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
              <Text.BodySM useI18n>common:text_download</Text.BodySM>
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
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: 46,
      paddingRight: spacing.padding.big,
      paddingVertical: spacing.padding.base,
    },
    image: {
      width: scaleSize(307),
      height: scaleSize(225.5),
      backgroundColor: colors.placeholder,
    },
    videoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      width: scaleSize(307),
      height: scaleSize(225.5),
      backgroundColor: colors.placeholder,
    },
    iconPlay: {
      position: 'absolute',
      zIndex: 1,
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
