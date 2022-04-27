// fieldName: field name in group profile to be edited

import i18next from 'i18next';
import Button from '~/beinComponents/Button';
import ImagePicker from '~/beinComponents/ImagePicker';
import Markdown from '~/beinComponents/Markdown';
import {IUploadType} from '~/configs/resourceConfig';
import {IFilePicked} from '~/interfaces/common';
import groupsActions from '~/screens/Groups/redux/actions';
import modalActions from '~/store/modal/actions';
import {groupProfileImageCropRatio} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {checkPermission} from '~/utils/permission';

const uploadFile = (
  dispatch: any,
  id: number,
  file: IFilePicked,
  fieldName: 'icon' | 'background_img_url',
  uploadType: IUploadType,
) => {
  dispatch(
    groupsActions.uploadImage({
      id,
      file,
      fieldName,
      uploadType,
    }),
  );
};

// 'icon' for avatar and 'background_img_url' for cover
export const _openImagePicker = (
  dispatch: any,
  id: number,
  fieldName: 'icon' | 'background_img_url',
  uploadType: IUploadType,
) => {
  checkPermission('photo', dispatch, canOpenPicker => {
    if (canOpenPicker) {
      ImagePicker.openPickerSingle({
        ...groupProfileImageCropRatio[fieldName],
        cropping: true,
        mediaType: 'photo',
      }).then(file => {
        uploadFile(dispatch, id, file, fieldName, uploadType);
      });
    }
  });
};

export const alertAction = (
  dispatch: any,
  theme: ITheme,
  title: string,
  content: string,
  doAction: () => void,
) => {
  const alertPayload = {
    title: title,
    content: content,
    ContentComponent: Markdown,
    contentProps: {
      value: content,
    },
    cancelBtn: true,
    cancelBtnProps: {
      textColor: theme.colors.primary7,
    },
    onConfirm: () => doAction(),
    confirmLabel: i18next.t('common:btn_confirm'),
    ConfirmBtnComponent: Button.Secondary,
    confirmBtnProps: {highEmphasis: true},
  };

  dispatch(modalActions.showAlert(alertPayload));
};
