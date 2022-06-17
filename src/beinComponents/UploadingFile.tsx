import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IUploadType} from '~/configs/resourceConfig';
import {IFilePicked} from '~/interfaces/common';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {formatBytes} from '~/utils/formatData';
import {isEmpty} from 'lodash';
import FileUploader, {IGetFile} from '~/services/fileUploader';
import {useBaseHook} from '~/hooks';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import {supportedTypes} from '~/beinComponents/DocumentPicker';
import {openLink} from '~/utils/common';
import {uploadTypes} from '~/configs/resourceConfig';

export interface UploadingFileProps {
  style?: StyleProp<ViewStyle>;
  url?: string;
  uploadType?: IUploadType;
  file?: IFilePicked;
  disableClose?: boolean;
  showDownload?: boolean;
  onClose?: (file: IFilePicked) => void;
  onSuccess?: (file: IGetFile) => void;
  onError?: (e?: any) => void;
}

const UploadingFile: FC<UploadingFileProps> = ({
  style,
  uploadType,
  file,
  showDownload,
  disableClose,
  onClose,
  onSuccess,
  onError,
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
    if (!uploadType) {
      return;
    }

    const ext = fileName?.split('.')?.pop?.();

    // temp skip check extention for video
    if (
      uploadType !== uploadTypes.postVideo &&
      uploadType !== uploadTypes.commentVideo &&
      !supportedTypes.includes(ext)
    ) {
      setError(t('upload:text_file_extension_not_supported'));
      return;
    }

    //ensure file not uploaded
    if (!file || isEmpty(file) || file?.id || file?.url) {
      setUploading(false);
      return;
    }

    setError('');
    setUploading(true);
    await FileUploader.getInstance().upload({
      file,
      uploadType,
      onProgress: _onProgress,
      onSuccess: _onSuccess,
      onError: _onError,
    });
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
      FileUploader.getInstance().cancel({file, uploadType});
    } else {
      dispatch(
        modalActions.showAlert({
          title: t('upload:title_delete_file', {
            file_type: t(`file_type:${uploadType}`),
          }),
          content: t('upload:text_delete_file', {
            file_type: t(`file_type:${uploadType}`),
          }),
          cancelBtn: true,
          cancelLabel: t('common:btn_cancel'),
          confirmLabel: t('common:btn_delete'),
          onConfirm: () => {
            setError('');
            onClose?.(file);
          },
        }),
      );
    }
  };

  const onPressRetry = () => {
    uploadFile();
  };

  const onPressDownload = () => {
    openLink(file.url);
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
      {showDownload && !!file.url && (
        <Button
          hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
          onPress={onPressDownload}>
          <Icon icon={'download'} />
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
