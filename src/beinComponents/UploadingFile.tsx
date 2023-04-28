import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { isEmpty } from 'lodash';
import Text from '~/baseComponents/Text';
import { IUploadType, uploadTypes } from '~/configs/resourceConfig';
import { IFilePicked } from '~/interfaces/common';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import { formatBytes } from '~/utils/formatter';
import { useBaseHook } from '~/hooks';
import { supportedTypes } from '~/beinComponents/DocumentPicker';
import { openUrl } from '~/utils/link';
import { getFileIcons } from '~/configs';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';
import useUploaderStore, { IGetFile } from '~/store/uploader';
import useModalStore from '~/store/modal';

const HIT_SLOP = {
  top: 10, left: 10, right: 10, bottom: 10,
};

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
  onPressDownload?: () => void;
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
  onPressDownload,
}: UploadingFileProps) => {
  const { showAlert } = useModalStore((state) => state.actions);
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const fileName = file?.name || file?.filename || file?.fileName;

  const actions = useUploaderStore((state) => state.actions);
  const errorUpload = useUploaderStore(useCallback((state) => state.errors[fileName], [fileName]));
  const uploadProgress = useUploaderStore(useCallback((state) => state.uploadingFiles[fileName], [fileName]));
  const uploadedFile = useUploaderStore(useCallback((state) => state.uploadedFiles[fileName], [fileName]));
  const isUploading = uploadProgress !== undefined;
  const [error, setError] = useState('');

  useEffect(() => {
    if (errorUpload) {
      setError(errorUpload);
      onError?.(errorUpload);
    }
  }, [errorUpload]);

  useEffect(() => {
    if (uploadedFile) {
      onSuccess?.(uploadedFile);
    }
  }, [uploadedFile]);

  useEffect(
    () => {
      if (file && !isUploading) {
        uploadFile();
      }
    }, [file],
  );

  const uploadFile = async () => {
    if (!uploadType) {
      return;
    }

    const ext = fileName?.split('.')?.pop?.();

    // temp skip check extention for video
    if (
      uploadType !== uploadTypes.postVideo
      && uploadType !== uploadTypes.commentVideo
      && !supportedTypes.includes(ext)
    ) {
      setError(t('upload:text_file_extension_not_supported'));
      return;
    }

    // ensure file not uploaded
    if (!file || isEmpty(file) || file?.id || file?.url) {
      return;
    }

    setError('');
    actions.upload({ file, uploadType });
  };

  const onPressClose = () => {
    if (isUploading) {
      onClose?.(file);
      actions.cancel(file);
    } else {
      const type = uploadType?.split('_')[1];

      showAlert({
        title: t(
          'upload:title_delete_file', {
            file_type: t(`file_type:${type}`),
          },
        ),
        content: t(
          'upload:text_delete_file', {
            file_type: t(`file_type:${type}`),
          },
        ),
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_delete'),
        onConfirm: () => {
          onClose?.(file);
        },
      });
    }
  };

  const onPressRetry = () => {
    uploadFile();
  };

  const _onPressDownload = () => {
    onPressDownload?.();
    openUrl(file.url);
  };

  if (!file || isEmpty(file)) {
    return null;
  }

  const fileExt = fileName?.split('.')?.pop?.()?.toUpperCase?.();

  const icon = getFileIcons(fileExt) as IconType;

  return (
    <View testID="uploading_file" style={[styles.container, style]}>
      <Icon size={22} icon={icon} style={styles.iconFile} />
      <View style={styles.contentContainer}>
        <Text.SubtitleXS
          color={colors.neutral80}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {fileName}
          <Text.BodyXS color={colors.neutral40}>{`  (${formatBytes(file?.size)})`}</Text.BodyXS>
        </Text.SubtitleXS>
        {!isUploading && !!error && (
          <Text.BodyXSMedium useI18n color={colors.red40}>
            {error}
          </Text.BodyXSMedium>
        )}
        {!error && !!isUploading && (
          <Text.BodyXSMedium
            style={{ justifyContent: 'center' }}
            color={colors.green50}
            numberOfLines={1}
          >
            {t('common:text_uploading')}
          </Text.BodyXSMedium>
        )}
      </View>
      {!isUploading && !!error && (
        <Button
          style={{ marginRight: spacing.margin.large }}
          hitSlop={HIT_SLOP}
          onPress={onPressRetry}
        >
          <Icon icon="RotateRight" size={16} tintColor={colors.neutral40} />
        </Button>
      )}
      {!disableClose && (
        <Button
          testID="uploading_file.btn_close"
          hitSlop={HIT_SLOP}
          onPress={onPressClose}
        >
          <Icon size={16} icon="iconCloseSmall" tintColor={colors.neutral40} />
        </Button>
      )}
      {showDownload && !!file.url && (
        <Button
          hitSlop={HIT_SLOP}
          onPress={_onPressDownload}
        >
          <Icon icon="ArrowDownToLine" size={16} tintColor={colors.neutral40} />
        </Button>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.gray1,
    },
    contentContainer: {
      padding: spacing.padding.tiny,
      flex: 1,
    },
    iconFile: {
      marginRight: spacing.margin.tiny,
    },
  });
};

export default UploadingFile;
