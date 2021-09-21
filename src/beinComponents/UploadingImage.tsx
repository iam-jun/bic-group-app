import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import FileUploader, {IUploadParam, IUploadType} from '~/services/fileUploader';
import {IFilePicked} from '~/interfaces/common';
import Image from '~/beinComponents/Image';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';

export interface UploadingImageProps {
  style?: StyleProp<ViewStyle>;
  uploadType: IUploadType | string;
  file?: IFilePicked;
  fileName?: string;
  url?: string;
  width?: number;
  height?: number;
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
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const upload = async () => {
    if (url) {
      setImageUrl(url);
    } else if (file) {
      const param: IUploadParam = {
        uploadType,
        file,
        onSuccess: uploadedUrl => {
          setImageUrl(uploadedUrl);
          onUploadSuccess?.(uploadedUrl, fileName || '');
        },
        onError: e => {
          setError(
            typeof e === 'string' ? e : t('common:error_upload_photo_failed'),
          );
        },
      };
      try {
        await FileUploader.getInstance().upload(param);
      } catch (e) {
        console.log(`\x1b[35m🐣️ UploadingImage upload error:`, e, `\x1b[0m`);
      }
    }
  };

  useEffect(() => {
    upload();
  }, []);

  const renderRemove = () => {
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
        <Image style={styles.image} source={imageUrl} />
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
      // justifyContent: 'center',
      // alignItems: 'center',
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
