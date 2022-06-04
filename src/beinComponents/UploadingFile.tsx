import React, {FC, useEffect, useState} from 'react';
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
import {useBaseHook} from '~/hooks';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';

export interface UploadingFileProps {
  style?: StyleProp<ViewStyle>;
  uploadType?: IUploadType | string;
  file?: IFilePicked;
  url?: string;
  onClose?: (file: IFilePicked) => void;
  onSuccess?: (file: IGetFile) => void;
  onError?: (e?: any) => void;
  disableClose?: boolean;
}

const UploadingFile: FC<UploadingFileProps> = ({
  style,
  uploadType,
  file,
  onClose,
  onSuccess,
  onError,
  disableClose,
}: UploadingFileProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const fileName = file?.name || file?.filename || file?.fileName;

  const _onProgress = (percent: number) => {
    //todo handle anim progress
    console.log(`\x1b[36m🐣️ UploadingFile onProgress: ${percent}\x1b[0m`);
  };

  const _onSuccess = (data: IGetFile) => {
    setUploading(false);
    onSuccess?.(data);
  };

  const _onError = (e: any) => {
    setUploading(false);
    setError(e);
    onError?.(e);
  };

  const uploadFile = async () => {
    if (!uploadTypes) {
      return;
    }
    if (
      uploadType === uploadTypes.postVideo ||
      uploadType === uploadTypes.commentVideo
    ) {
      //ensure video not uploaded
      if (file && !isEmpty(file) && !file?.id && !file?.url) {
        setError('');
        setUploading(true);
        await VideoUploader.getInstance().upload({
          file,
          uploadType,
          onProgress: _onProgress,
          onSuccess: _onSuccess,
          onError: _onError,
        });
      } else {
        setUploading(false);
      }
    } else {
      //todo upload file
    }
  };

  useEffect(() => {
    uploadFile();
  }, [file]);

  if (!file || isEmpty(file)) {
    return null;
  }

  const onPressClose = () => {
    if (uploading) {
      onClose?.(file);
      VideoUploader.getInstance().cancel({file, uploadType});
    } else {
      dispatch(
        modalActions.showAlert({
          title: t('upload:title_delete_video'),
          content: t('upload:title_delete_video'),
          cancelBtn: true,
          cancelLabel: t('common:btn_cancel'),
          confirmLabel: t('common:btn_delete'),
          onConfirm: () => onClose?.(file),
        }),
      );
    }
  };

  const onPressRetry = () => {
    uploadFile();
  };

  return (
    <View style={[styles.container, style]}>
      <Icon size={40} icon={'iconFileVideo'} />
      <View style={styles.contentContainer}>
        <Text.BodyS
          color={error ? colors.error : colors.textPrimary}
          numberOfLines={1}>
          {fileName}
        </Text.BodyS>
        {!!error ? (
          <Text.Subtitle useI18n color={colors.error}>
            {error}
          </Text.Subtitle>
        ) : (
          <Text.Subtitle
            style={{justifyContent: 'center'}}
            color={colors.textSecondary}
            numberOfLines={1}>
            {fileName?.split('.')?.pop?.()?.toUpperCase?.()} ∙{' '}
            {uploading
              ? t('common:text_uploading')
              : formatBytes(file?.size || 0)}
          </Text.Subtitle>
        )}
      </View>
      {!!error && (
        <Button
          style={{marginRight: spacing.margin.large}}
          hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
          onPress={onPressRetry}>
          <Icon icon={'Redo'} />
        </Button>
      )}
      {!disableClose && (
        <Button
          hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
          onPress={onPressClose}>
          <Icon icon={'iconCloseSmall'} />
        </Button>
      )}
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
