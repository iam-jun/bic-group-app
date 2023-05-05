import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle, Image as RNImage,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import Image from '~/beinComponents/Image';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/baseComponents/Text';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';

import spacing from '~/theme/spacing';
import useUploaderStore, { IGetFile } from '~/store/uploader';
import { AppConfig } from '~/configs';
import { formatBytes } from '~/utils/formatter';

export interface UploadingImageProps {
  style?: StyleProp<ViewStyle>;
  styleError?: StyleProp<ViewStyle>;
  uploadType: ResourceUploadType;
  file?: IFilePicked;
  fileName?: string;
  url?: string;
  width?: number | string;
  height?: number | string;
  onUploadSuccess?: (file: IGetFile) => void;
  onPressRemove?: () => void;
  onError?: (error) => void;
  renderError?: any;
  showThumbnail?: boolean;
}

const UploadingImage: FC<UploadingImageProps> = ({
  style,
  styleError,
  uploadType,
  file,
  fileName,
  url,
  width,
  height,
  onUploadSuccess,
  onPressRemove,
  onError,
  renderError,
  showThumbnail = false,
}: UploadingImageProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const actions = useUploaderStore((state) => state.actions);
  const uploadError = useUploaderStore(useCallback((state) => state.errors[fileName], [fileName]));
  const uploadedFile = useUploaderStore(useCallback((state) => state.uploadedFiles[fileName], [fileName]));
  const uploadingFile = useUploaderStore(useCallback((state) => state.uploadingFiles[fileName], [fileName]));

  const [imageUrl, setImageUrl] = useState<string>(url);
  const [error, setError] = useState('');

  useEffect(() => {
    if (uploadError) {
      const errorMessage = typeof uploadError === 'string' ? uploadError : t('post:error_upload_photo_failed');
      setError(errorMessage);
    }
  }, [uploadError]);

  useEffect(() => {
    onError?.(error);
  }, [error]);

  useEffect(() => {
    if (uploadedFile) {
      setError('');
      _setImageUrl(uploadedFile.url);
      onUploadSuccess?.(uploadedFile);
    }
  }, [uploadedFile]);

  const _setImageUrl = (url: string) => {
    if (url?.includes('http')) {
      setImageUrl(url);
    }
  };

  const upload = async () => {
    if (file?.size > AppConfig.maxFileSize.image) {
      const error = t('common:error:file:over_file_size').replace('{n}', formatBytes(AppConfig.maxFileSize.image, 0));
      setError(error);
      return;
    }

    if (url) {
      _setImageUrl(url);
    } else if (file) {
      actions.uploadImage({ file, uploadType });
    }
  };

  useEffect(() => {
    // clear error when user select new file
    setError('');
    if (file) upload();
  }, [url, fileName, file]);

  useEffect(() => {
    setImageUrl(url);
  }, [url]);

  const _onPressRemove = () => {
    // cancle upload image if uploading
    if (uploadingFile) {
      actions.cancel(file);
    }
    onPressRemove();
  }

  const renderRemove = () => {
    if (!onPressRemove) {
      return null;
    }
    return (
      <Button
        testID="upload_image.button_close"
        style={styles.icRemove}
        onPress={_onPressRemove}
      >
        <Icon size={14} icon="iconCloseSmall" tintColor={colors.neutral40} />
      </Button>
    );
  };

  const renderThumbnail = () => {
    const backgroundColor = showThumbnail ? colors.white : colors.neutral1;

    if (!showThumbnail) return <View style={[styles.mask, { backgroundColor, zIndex: 0 }]} />;

    return (
      <View style={styles.boxThumbnail}>
        <RNImage source={{ uri: file?.uri }} style={styles.thumbnailLoading} />
        <View style={[styles.mask, { backgroundColor }]} />
      </View>
    );
  }

  const renderLoading = () => (
    <View style={styles.contentContainer}>
      {renderThumbnail()}
      <LoadingIndicator size="large" color={colors.purple50} />
    </View>
  );

  const renderErrorContent = () => {
    if (uploadingFile) return (
      <LoadingIndicator size="large" color={colors.purple50} />
    );

    return (
      <React.Fragment>
        <Icon icon="CircleExclamation" tintColor={colors.red40} size={30} />
        <Text.BodyM style={styles.textError}>{error}</Text.BodyM>
        <Button.Primary
          type='ghost'
          style={styles.btnRetry}
          onPress={() => upload()}
          useI18n
        >
          common:text_retry
        </Button.Primary>
      </React.Fragment>
    );
  };

  if (error) {
    if (renderError) {
      return renderError(error);
    }
    return (
      <View style={[styles.errorContainer, { width, height }, styleError]}>
        {renderThumbnail()}
        {renderErrorContent()}
        {renderRemove()}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { width, height }, style]}
      testID="upload_image"
    >
      {!!imageUrl ? (
        <Image source={imageUrl} style={styles.image} />
      ) : renderLoading()}
      {renderRemove()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderRadius: spacing.borderRadius.large,
      overflow: 'hidden',
    },
    contentContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing.borderRadius.large,
      overflow: 'hidden',
    },
    image: { width: '100%', height: '100%' },
    icRemove: {
      position: 'absolute',
      top: spacing.margin.small,
      right: spacing.margin.small,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.neutral2,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.neutral80,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    btnRetry: {
      marginTop: spacing.margin.small,
      backgroundColor: colors.purple2,
    },
    textError: {
      marginHorizontal: spacing.margin.extraLarge,
      marginTop: spacing.margin.small,
      color: colors.red40,
      textAlign: 'center',
    },
    boxThumbnail: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    thumbnailLoading: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
    },
    mask: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      opacity: 0.8,
    },
  });
};

export default UploadingImage;
