import ImagePicker from '~/components/ImagePicker';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { IFilePicked } from '~/interfaces/common';
import { groupProfileImageCropRatio } from '~/theme/dimension';
import { checkPermission, PermissionTypes } from '~/utils/permission';
import { AppConfig } from '~/configs';
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
      ImagePicker.openPickerSinglePhotoWithCropping({
        ...groupProfileImageCropRatio[fieldName],
        maxSize: AppConfig.groupImageMaxSize,
      })
        .then((file) => {
          uploadFile({
            id,
            file,
            fieldName,
            uploadType,
            destination,
            rootGroupId,
          });
        })
        .catch((err) => {
          console.error(err);
        });
      return true;
    }
    return false;
  });

  // for testing
  return false;
};
