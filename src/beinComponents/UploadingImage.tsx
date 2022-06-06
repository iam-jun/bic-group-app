import React, {FC, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Text from '~/beinComponents/Text';
import {getResourceUrl, IUploadType} from '~/configs/resourceConfig';
import {useBaseHook} from '~/hooks';
import {IFilePicked} from '~/interfaces/common';
import FileUploader, {IGetFile, IUploadParam} from '~/services/fileUploader';
import {ITheme} from '~/theme/interfaces';

export interface UploadingImageProps {
  style?: StyleProp<ViewStyle>;
  uploadType: IUploadType | string;
  file?: IFilePicked;
  fileName?: string;
  url?: string;
  width?: number | string;
  height?: number | string;
  onUploadSuccess?: (url: string, fileName: string) => void;
  onPressRemove?: () => void;
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
}: UploadingImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [error, setError] = useState('');

  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const _setImageUrl = (url: string) => {
    if (url.includes('http')) {
      setImageUrl(url);
    } else {
      setImageUrl(getResourceUrl(uploadType, url));
    }
  };

  const upload = async () => {
    if (url) {
      _setImageUrl(url);
    } else if (file) {
      const param: IUploadParam = {
        uploadType,
        file,
        onSuccess: (data: IGetFile) => {
          setError('');
          _setImageUrl(data.url || '');
          onUploadSuccess?.(data.url || '', fileName || '');
        },
        onError: e => {
          setError(
            typeof e === 'string' ? e : t('post:error_upload_photo_failed'),
          );
        },
      };
      try {
        await FileUploader.getInstance().upload(param);
      } catch (e) {
        console.log(`\x1b[35m🐣️ UploadingImage upload error:`, e, `\x1b[0m`);
      }
    } else if (fileName) {
      const result: IGetFile = FileUploader.getInstance().getFile(
        fileName,
        (data: IGetFile) => {
          _setImageUrl(data.url || '');
          onUploadSuccess?.(data.url || '', fileName || '');
        },
        undefined,
        e => {
          setError(
            typeof e === 'string' ? e : t('post:error_upload_photo_failed'),
          );
        },
      );
      if (result?.url) {
        _setImageUrl(result?.url);
      }
    }
  };

  useEffect(() => {
    upload();
  }, [url, fileName, file]);

  const renderRemove = () => {
    if (!onPressRemove) {
      return null;
    }
    return (
      <Button style={styles.icRemove} onPress={onPressRemove}>
        <Icon size={12} icon={'iconCloseSmall'} />
      </Button>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon icon={'iconUploadImage'} tintColor={colors.error} />
        <Text.H6S style={styles.textError}>{error}</Text.H6S>
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
      style={StyleSheet.flatten([styles.container, {width, height}, style])}>
      {imageUrl ? (
        <Image source={imageUrl} useOnLayoutSize={false} style={styles.image} />
      ) : (
        <View style={styles.contentContainer}>
          <LoadingIndicator size={'large'} />
        </View>
      )}
      {renderRemove()}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
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
      backgroundColor: colors.surface,
      marginBottom: spacing.margin.large,
    },
    image: {width: '100%', height: '100%'},
    icRemove: {
      position: 'absolute',
      top: spacing.margin.small,
      right: spacing.margin.small,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.iconTint,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    textError: {
      marginHorizontal: spacing.margin.extraLarge,
      marginTop: spacing.margin.small,
      color: colors.error,
    },
    textRetry: {
      color: colors.primary7,
      marginTop: spacing.margin.small,
    },
  });
};

export default UploadingImage;
