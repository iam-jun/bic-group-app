import ImagePicker from '~/beinComponents/ImagePicker';
import { IUploadType } from '~/configs/resourceConfig';
import speakingLanguages from '~/constants/speakingLanguages';
import { IFilePicked } from '~/interfaces/common';
import { userProfileImageCropRatio } from '~/theme/dimension';
import { checkPermission, permissionTypes } from '~/utils/permission';
import menuActions from '../redux/actions';

export const getLanguages = (language: string[]) => {
  const userLanguageList = language?.map((
    code: string,
  ) => speakingLanguages[code].name);

  return userLanguageList?.join(', ');
}

export const _openImagePicker = async (
  id: string,
  fieldName: 'avatar' | 'backgroundImgUrl',
  uploadType: IUploadType,
  dispatch:any,
) => {
  checkPermission(
    permissionTypes.photo, dispatch, (canOpenPicker) => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle({
          ...userProfileImageCropRatio[fieldName],
          cropping: true,
          mediaType: 'photo',
        }).then((file) => {
          uploadFile(
            id,
            file,
            fieldName,
            uploadType,
            dispatch,
          );
        });
      }
    },
  );
};

const uploadFile = (
  id: string,
  file: IFilePicked,
  fieldName: 'avatar' | 'backgroundImgUrl',
  uploadType: IUploadType,
  dispatch: any,
  callback?: (fieldName: string) => void,
) => {
  dispatch(menuActions.uploadImage(
    {
      id,
      file,
      fieldName,
      uploadType,
    },
    () => {
      callback?.(fieldName);
    },
  ));
};
