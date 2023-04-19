import ImagePicker from '~/beinComponents/ImagePicker';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { IFilePicked } from '~/interfaces/common';
import { groupProfileImageCropRatio } from '~/theme/dimension';
import useGroupsStore from '~/store/entities/groups';
import { checkPermission, PermissionTypes } from '~/utils/permission';

export const uploadFile = ({
  dispatch,
  ...props
}:{
  dispatch: any;
  id: string;
  file: IFilePicked;
  fieldName: 'icon' | 'backgroundImgUrl';
  uploadType: ResourceUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}) => {
  useGroupsStore.getState().actions.uploadImage({ ...props });
};

// 'icon' for avatar and 'backgroundImgUrl' for cover
export const _openImagePicker = async ({
  dispatch,
  id,
  fieldName,
  uploadType,
  destination,
  rootGroupId,
}:{
  dispatch: any;
  id: string;
  fieldName: 'icon' | 'backgroundImgUrl';
  uploadType: ResourceUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}) => {
  await checkPermission(
    PermissionTypes.photo, (canOpenPicker:boolean) => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle({
          ...groupProfileImageCropRatio[fieldName],
          cropping: true,
          mediaType: 'photo',
        }).then((file) => {
          uploadFile(
            {
              dispatch, id, file, fieldName, uploadType, destination, rootGroupId,
            },
          );
        });
        return true;
      }
      return false;
    },
  );

  // for testing
  return false;
};
