// fieldName: field name in group profile to be edited

import { ExtendedTheme } from '@react-navigation/native';
import i18next from 'i18next';
import { Button } from '~/baseComponents';
import ImagePicker from '~/beinComponents/ImagePicker';
import Markdown from '~/beinComponents/Markdown';
import { IUploadType } from '~/configs/resourceConfig';
import { IFilePicked } from '~/interfaces/common';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { groupProfileImageCropRatio } from '~/theme/dimension';

import { checkPermission, permissionTypes } from '~/utils/permission';

export const uploadFile = ({
  dispatch,
  ...props
}:{
  dispatch: any;
  id: string;
  file: IFilePicked;
  fieldName: 'icon' | 'backgroundImgUrl';
  uploadType: IUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}) => {
  dispatch(groupsActions.uploadImage({ ...props }));
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
  uploadType: IUploadType;
  destination: 'group' | 'community';
  rootGroupId: string;
}) => {
  await checkPermission(
    permissionTypes.photo, dispatch, (canOpenPicker:boolean) => {
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

export const alertAction = (
  dispatch: any,
  theme: ExtendedTheme,
  title: string,
  content: string,
  doAction: () => void,
) => {
  const alertPayload = {
    title,
    content,
    ContentComponent: Markdown,
    contentProps: {
      value: content,
    },
    cancelBtn: true,
    onConfirm: () => doAction(),
    confirmLabel: i18next.t('common:btn_confirm'),
    ConfirmBtnComponent: Button.Primary,
  };

  dispatch(modalActions.showAlert(alertPayload));
};
