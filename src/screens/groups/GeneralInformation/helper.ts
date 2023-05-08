import { t } from 'i18next';
import { Platform } from 'react-native';
import ImagePicker from '~/beinComponents/ImagePicker';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { IFilePicked } from '~/interfaces/common';
import { groupProfileImageCropRatio } from '~/theme/dimension';
import { checkPermission, PermissionTypes } from '~/utils/permission';
import { AppConfig } from '~/configs';
import { formatBytes } from '~/utils/formatter';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToast from '~/store/helper/showToast';
import useGeneralInformationStore from './store';
import { FieldNameImageUpload } from '~/interfaces/IGroup';

export const uploadFile = ({
  ...props
}:{
  id: string;
  file: IFilePicked;
  fieldName: FieldNameImageUpload;
  uploadType: ResourceUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}) => {
  useGeneralInformationStore.getState().actions.uploadImage({ ...props });
};

export const _openImagePicker = async ({
  id,
  fieldName,
  uploadType,
  destination,
  rootGroupId,
}:{
  id: string;
  fieldName: FieldNameImageUpload;
  uploadType: ResourceUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}) => {
  await checkPermission(PermissionTypes.photo, (canOpenPicker: boolean) => {
    if (canOpenPicker) {
      ImagePicker.openPickerSingle({
        ...groupProfileImageCropRatio[fieldName],
        cropping: true,
        mediaType: 'photo',
      })
        .then((file) => {
          const isValidFileSelected = checkFileSelected(file);
          if (isValidFileSelected) {
            uploadFile({
              id,
              file,
              fieldName,
              uploadType,
              destination,
              rootGroupId,
            });
          }
        })
        .catch((err) => {
          showToast({ content: err?.message, type: ToastType.ERROR });
        });
      return true;
    }
    return false;
  });

  // for testing
  return false;
};

const checkFileSelected = (file: IFilePicked) => {
  if (Platform.OS === 'ios') {
    if (file?.sourceURL?.includes('GIF') || file?.sourceURL?.includes('WEBP')) {
      const error = t('common:error:file:file_type_not_support');
      showToast({ content: error, type: ToastType.ERROR });
      return false;
    }
  }

  if (file?.size > AppConfig.groupImageMaxSize) {
    const error = t('common:error:file:file_exceed_limit').replace('{n}', formatBytes(AppConfig.groupImageMaxSize, 0));
    showToast({ content: error, type: ToastType.ERROR });
    return false;
  }

  return true;
};
