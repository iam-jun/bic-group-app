import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import Image from '~/components/Image';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/baseComponents/Text';
import { getResourceUrl, IUploadType } from '~/configs/resourceConfig';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';

import spacing from '~/theme/spacing';
import useUploaderStore, { IGetFile } from '~/store/uploader';
import { AppConfig } from '~/configs';
import { formatBytes } from '~/utils/formatter';

export interface UploadingImageProps {
  style?: StyleProp<ViewStyle>;
  uploadType: IUploadType | string;
  file?: IFilePicked;
  fileName?: string;
  url?: string;
  width?: number | string;
  height?: number | string;
  onUploadSuccess?: (file: IGetFile) => void;
  onPressRemove?: () => void;
  onError?: (error) => void;
  renderError?: any;
}

const UploadingImage: FC<UploadingImageProps> = ({
  style,
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
}: UploadingImageProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const actions = useUploaderStore((state) => state.actions);
  const uploadError = useUploaderStore(useCallback((state) => state.errors[fileName], [fileName]));
  const uploadedFile = useUploaderStore(useCallback((state) => state.uploadedFiles[fileName], [fileName]));

  const [imageUrl, setImageUrl] = useState<string>(url);
  const [error, setError] = useState('');

  const imgWidthStyle = typeof width === 'number' ? width : '100%';

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
    } else {
      setImageUrl(getResourceUrl(
        uploadType, url,
      ));
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
      actions.upload({ type: 'image', file, uploadType });
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

  const renderRemove = () => {
    if (!onPressRemove) {
      return null;
    }
    return (
      <Button
        testID="upload_image.button_close"
        style={styles.icRemove}
        onPress={onPressRemove}
      >
        <Icon size={12} icon="iconCloseSmall" />
      </Button>
    );
  };

  if (error) {
    if (renderError) {
      return renderError(error);
    }
    return (
      <View style={styles.errorContainer}>
        <Icon icon="Image" tintColor={colors.red60} />
        <Text.H6 style={styles.textError}>{error}</Text.H6>
        <Button onPress={() => upload()}>
          <Text.H6 style={styles.textRetry} useI18n>
            common:text_retry
          </Text.H6>
        </Button>
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
        <Image source={imageUrl} style={{ height: '100%', width: imgWidthStyle }} />
      ) : (
        <View style={styles.contentContainer}>
          <LoadingIndicator size="large" />
        </View>
      )}
      {renderRemove()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral1,
      borderRadius: spacing.borderRadius.small,
      overflow: 'hidden',
    },
    contentContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      height: 134,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.neutral1,
      marginBottom: spacing.margin.large,
    },
    image: { width: '100%', height: '100%' },
    icRemove: {
      position: 'absolute',
      top: spacing.margin.small,
      right: spacing.margin.small,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.neutral80,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    textError: {
      marginHorizontal: spacing.margin.extraLarge,
      marginTop: spacing.margin.small,
      color: colors.red60,
    },
    textRetry: {
      color: colors.purple60,
      marginTop: spacing.margin.small,
    },
  });
};

export default UploadingImage;
