import { isEmpty } from 'lodash';
import ImagePicker from '~/beinComponents/ImagePicker';
import { IUploadType } from '~/configs/resourceConfig';
import { IFilePicked } from '~/interfaces/common';
import { userProfileImageCropRatio } from '~/theme/dimension';
import { formatDate } from '~/utils/formatData';
import { checkPermission, permissionTypes } from '~/utils/permission';
import menuActions from '../../../storeRedux/menu/actions';
import useUserProfileStore from './store';

export const getLanguages = (language: string[]) => {
  if (isEmpty(language)) return '';

  const mapLanguages = useUserProfileStore.getState().languages.reduce((acc, cur) => ({
    ...acc,
    [cur.code]: cur,
  }), {});

  const userLanguageList = language?.map((
    code: string,
  ) => mapLanguages[code]?.name);

  return userLanguageList?.join(', ');
};

export const getEndDateText = (
  t: any,
  currentlyWorkHere: boolean,
  endDate: string,
) => (currentlyWorkHere
  ? t('common:text_present')
  : endDate
    ? formatDate(
      endDate,
      'MMM D, YYYY',
    )
    : '');

export const formatPhoneNumber = (
  phone: string | null | undefined,
  countryCode: string,
) => (countryCode && phone ? `(${countryCode}) ${phone}` : '');

export const _openImagePicker = async (
  id: string,
  fieldName: 'avatar' | 'backgroundImgUrl',
  uploadType: IUploadType,
  dispatch:any,
  callback?: (fieldName: string) => void,

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
            callback,
          );
        });
      }
    },
  );
};

export const uploadFile = (
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
