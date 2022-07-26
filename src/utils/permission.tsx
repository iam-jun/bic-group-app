import React from 'react';
import { Platform } from 'react-native';
import {
  check, request, PERMISSIONS, RESULTS,
} from 'react-native-permissions';
import i18next from 'i18next';
import modalActions from '~/store/modal/actions';
import { photo_permission_steps } from '~/constants/permissions';
import PermissionsPopupContent from '~/beinComponents/PermissionsPopupContent';
import { IPayloadShowModal } from '~/interfaces/common';

export enum permissionTypes {
  photo = 'photo'
}

const PLATFORM_STORAGE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};
const REQUEST_PERMISSION_TYPE = {
  photo: PLATFORM_STORAGE_PERMISSIONS,
};

const requestPermission = async (type: permissionTypes) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
  try {
    const result = await request(permissions);
    return result;
  } catch (error) {
    console.error('>>>>>>>REQUEST PERMISSION ERROR>>>>>', error);
    return false;
  }
};

export const checkPermission = async (
  type: permissionTypes,
  dispatch: any,
  callback: (canOpenPicker: boolean) => void,
) : Promise<boolean> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];

  try {
    const result = await check(permissions);

    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      if (result === RESULTS.DENIED) {
        const request = await requestPermission(type);
        if (request === RESULTS.GRANTED || request === RESULTS.LIMITED) {
          callback(true);
        } else {
          callback(false);
        }
        return false;
      }
      const payload: IPayloadShowModal = {
        isOpen: true,
        closeOutSide: false,
        useAppBottomSheet: false,
        ContentComponent: (
          <PermissionsPopupContent
            title={i18next.t('common:permission_photo_title')}
            description={i18next.t('common:permission_photo_description')}
            steps={photo_permission_steps}
            goToSetting={() => {
              dispatch(modalActions.hideModal());
            }}
          />
        ),
      };
      dispatch(modalActions.showModal(payload));

      callback(false);
    } else {
      callback(true);
    }
  } catch (error) {
    console.error('>>>>>>>CHECK PERMISSION ERROR>>>>>', error);
    callback(false);
    return false;
  }
  return false;
};
