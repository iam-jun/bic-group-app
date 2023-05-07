import React, { FC, useEffect } from 'react';
import {
  Dimensions, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import { Button } from '~/baseComponents';
import images from '~/resources/images';
import Icon from '~/baseComponents/Icon';
import { ILinkPreview, ILinkPreviewCreatePost } from '~/interfaces/IPost';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

const WIDTH_THUMBNAIL = (Dimensions.get('window').width - spacing.margin.large * 2) / 3.5;

type LinkPreviewProps = {
  data: ILinkPreviewCreatePost | ILinkPreview;
  loadLinkPreview?: (url: string) => void;
  onClose?: () => void;
  showClose?: boolean;
};

const LinkPreview: FC<LinkPreviewProps> = ({
  data, loadLinkPreview, onClose, showClose = false,
}) => {
  const {
    url, domain, title, image, description,
  } = data;
  const { isLoading } = data as ILinkPreviewCreatePost;
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    if (url && !title && !description && !domain && !isLoading) {
      loadLinkPreview?.(url);
    }
  }, [url, title, description, domain, isLoading]);

  const onPress = () => {
    openUrl(url);
  };

  const onCloseLinkPreview = () => {
    onClose?.();
  };

  if (!url || (!title && !description && !domain && !isLoading)) return null;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingView]} testID="link_preview.loading">
        <LoadingIndicator size="small" />
      </View>
    );
  }

  return (
    <Button onPress={onPress} testID="link_preview">
      <View style={styles.container}>
        {!!image && <Image style={styles.thumbnail} source={image} placeholderSource={images.img_thumbnail_default} />}
        <View style={styles.metadata}>
          <Text.BodyM numberOfLines={1} color={colors.neutral40}>
            {domain}
          </Text.BodyM>
          {!!title && (
            <Text.SubtitleM numberOfLines={1} style={styles.text} color={colors.neutral60}>
              {title}
            </Text.SubtitleM>
          )}
          {!!description && (
            <Text.ParagraphS numberOfLines={2} style={styles.text} color={colors.neutral60}>
              {description}
            </Text.ParagraphS>
          )}
        </View>
        {!!showClose && (
          <TouchableOpacity
            onPress={onCloseLinkPreview}
            style={styles.buttonClose}
            testID="link_preview.close_btn"
          >
            <Icon size={12} tintColor={colors.neutral40} icon="Xmark" />
          </TouchableOpacity>
        )}
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    loadingView: {
      justifyContent: 'center',
      height: 82,
    },
    metadata: {
      flex: 1,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.small,
    },
    thumbnail: {
      width: WIDTH_THUMBNAIL,
      height: '100%',
      borderTopLeftRadius: spacing.borderRadius.large,
      borderBottomLeftRadius: spacing.borderRadius.large,
    },
    text: {
      marginTop: spacing.margin.xTiny,
    },
    buttonClose: {
      position: 'absolute',
      zIndex: 2,
      borderRadius: spacing.borderRadius.circle,
      backgroundColor: colors.neutral2,
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default LinkPreview;
