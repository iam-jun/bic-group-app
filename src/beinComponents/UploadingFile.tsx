import React, {FC, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IUploadType, uploadTypes} from '~/configs/resourceConfig';
import {IFilePicked} from '~/interfaces/common';
import VideoUploader from '~/services/videoUploader';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {formatBytes} from '~/utils/formatData';
import {isEmpty} from 'lodash';
import {IGetFile} from '~/services/fileUploader';

export interface UploadingFileProps {
  style?: StyleProp<ViewStyle>;
  uploadType: IUploadType | string;
  file?: IFilePicked;
  url?: string;
  onClose?: (file: IFilePicked) => void;
  onSuccess?: (file: IGetFile) => void;
  onError?: (e?: any) => void;
}

const UploadingFile: FC<UploadingFileProps> = ({
  uploadType,
  file,
  onClose,
  onSuccess,
  onError,
}: UploadingFileProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const fileName = file?.name || file?.filename || file?.fileName;

  const _onProgress = (percent: number) => {
    //todo handle anim progress
    console.log(`\x1b[36m🐣️ UploadingFile onProgress: ${percent}\x1b[0m`);
  };

  const _onSuccess = (data: IGetFile) => {
    onSuccess?.(data);
  };

  const _onError = (e: any) => {
    onError?.(e);
  };

  const uploadFile = async () => {
    if (
      uploadType === uploadTypes.postVideo ||
      uploadType === uploadTypes.commentVideo
    ) {
      //ensure video not uploaded
      if (file && !isEmpty(file) && !file?.id && !file?.url) {
        await VideoUploader.getInstance().upload({
          file,
          uploadType,
          onProgress: _onProgress,
          onSuccess: _onSuccess,
          onError: _onError,
        });
      }
    } else {
      //todo upload file
    }
  };

  useEffect(() => {
    uploadFile();
    //todo cancel uploading file
  }, [file]);

  if (!file || isEmpty(file)) {
    return null;
  }

  const onPressClose = () => {
    onClose?.(file);
  };

  return (
    <View style={styles.container}>
      <Icon size={40} icon={'iconFileVideo'} />
      <View style={styles.contentContainer}>
        <Text.BodyS numberOfLines={1} ellipsizeMode={'middle'}>
          {fileName}
        </Text.BodyS>
        <View style={{flexDirection: 'row'}}>
          <Text.Subtitle
            style={{justifyContent: 'center'}}
            color={colors.textSecondary}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {fileName?.split('.')?.pop?.()?.toUpperCase?.()} ∙{' '}
            {formatBytes(file?.size || 0)}
          </Text.Subtitle>
        </View>
      </View>
      <Button
        hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
        onPress={onPressClose}>
        <Icon icon={'iconCloseSmall'} />
      </Button>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.padding.large,
      padding: spacing.padding.small,
      borderColor: colors.borderDivider,
      borderWidth: 1,
      borderRadius: spacing.borderRadius.small,
    },
    contentContainer: {
      padding: spacing.padding.tiny,
      flex: 1,
    },
  });
};

export default UploadingFile;
