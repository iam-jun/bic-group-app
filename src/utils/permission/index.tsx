import React from 'react';
import { Platform } from 'react-native';
import {
  check, request, PERMISSIONS, RESULTS,
} from 'react-native-permissions';
import i18next from 'i18next';
import { photo_permission_steps } from '~/constants/permissions';
import PermissionsPopupContent from '~/beinComponents/PermissionsPopupContent';
import { IPayloadShowModal } from '~/interfaces/common';
import useModalStore from '~/store/modal';

export enum PermissionTypes {
  photo = 'photo',
  AddPhoto = 'AddPhoto',
}

const PlatformStoragePermissions = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};

const PlatformAddPhotoPermissions = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

const RequestPermissionType = {
  photo: PlatformStoragePermissions,
  AddPhoto: PlatformAddPhotoPermissions,
};

const requestPermission = async (type: PermissionTypes) => {
  const permissions = RequestPermissionType[type][Platform.OS];
  try {
    const result = await request(permissions);
    return result;
  } catch (error) {
    console.error(
      '>>>>>>>REQUEST PERMISSION ERROR>>>>>', error,
    );
    return false;
  }
};

export const checkPermission = async (
  type: PermissionTypes,
  callback: (canOpenPicker: boolean) => void,
  isShowAlertFailed = true,
) : Promise<boolean> => {
  const permissions = RequestPermissionType[type][Platform.OS];
  let canOpenPicker = false;

  try {
    const result = await check(permissions);

    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      if (result === RESULTS.DENIED) {
        const request = await requestPermission(type);
        if (request === RESULTS.GRANTED || request === RESULTS.LIMITED) {
          canOpenPicker = true;
        }
      }

      if (result === RESULTS.BLOCKED && isShowAlertFailed) {
        const payload: IPayloadShowModal = {
          isOpen: true,
          closeOutSide: false,
          useAppBottomSheet: false,
          animationType: 'fade',
          ContentComponent: (
            <PermissionsPopupContent
              title={i18next.t('common:permission_photo_title')}
              description={i18next.t('common:permission_photo_description')}
              steps={photo_permission_steps}
              goToSetting={() => useModalStore.getState().actions.hideModal()}
            />
          ),
        };
        useModalStore.getState().actions.showModal(payload);
      }
    } else {
      canOpenPicker = true;
    }
    callback(canOpenPicker);
  } catch (error) {
    console.error(
      '>>>>>>>CHECK PERMISSION ERROR>>>>>', error,
    );
    canOpenPicker = false;
    callback(canOpenPicker);
  }
  return false;
};
