import React, { FC, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import spacing from '~/theme/spacing';
import { openUrl } from '~/utils/link';
import { Button } from '~/baseComponents';
import images from '~/resources/images';
import Icon from '~/baseComponents/Icon';
import { ILinkPreview, ILinkPreviewCreatePost } from '~/interfaces/IPost';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

type LinkPreviewProps = {
  data: ILinkPreviewCreatePost | ILinkPreview;
  loadLinkPreview?: (url: string) => void;
  onClose?: () => void;
  showClose?: boolean;
};

const LinkPreview: FC<LinkPreviewProps> = ({
  data,
  loadLinkPreview,
  onClose,
  showClose = false,
}) => {
  const {
    url, domain, title, image,
  } = data;
  const { isLoading } = data as ILinkPreviewCreatePost;
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    if (url && !title && !domain && !isLoading) {
      loadLinkPreview?.(url);
    }
  }, [url, title, domain, isLoading]);

  const onPress = () => {
    openUrl(url);
  };

  const onCloseLinkPreview = () => {
    onClose?.();
  };

  if (!url || (!title && !domain && !isLoading)) return null;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingView]}>
        <LoadingIndicator size="small" />
      </View>
    );
  }

  return (
    <Button onPress={onPress}>
      <View style={styles.container}>
        {!!image && (
          <Image
            style={styles.thumbnail}
            source={image}
            placeholderSource={images.img_thumbnail_default}
          />
        )}
        <View style={styles.metadata}>
          <Text.BodyS numberOfLines={1} color={colors.neutral80}>
            {domain}
          </Text.BodyS>
          <Text.H6 numberOfLines={2} style={styles.title}>
            {title}
          </Text.H6>
        </View>
        {!!showClose && (
          <TouchableOpacity
            onPress={onCloseLinkPreview}
            style={styles.buttonClose}
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
      width: 92,
      height: 82,
      borderTopLeftRadius: spacing.borderRadius.large,
      borderBottomLeftRadius: spacing.borderRadius.large,
    },
    title: {
      marginTop: spacing.margin.small,
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
