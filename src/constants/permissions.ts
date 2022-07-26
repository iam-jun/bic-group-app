import { Platform } from 'react-native';
import i18next from 'i18next';
import { titleCase } from '~/utils/common';

export const photo_permission_steps = [
  {
    title: i18next.t(`common:permission_photo_list:${Platform.OS}:step_1`),
    leftIcon: `iconPermissionGuide1${titleCase(Platform.OS)}`,
    leftIconProps: {
      icon: `iconPermissionGuide1${titleCase(Platform.OS)}`,
      size: 20,
    },
  },
  {
    title: i18next.t(`common:permission_photo_list:${Platform.OS}:step_2`),
    leftIcon: `iconPermissionGuide2${titleCase(Platform.OS)}`,
    leftIconProps: {
      icon: `iconPermissionGuide2${titleCase(Platform.OS)}`,
      size: 20,
    },
  },
  {
    title: i18next.t(`common:permission_photo_list:${Platform.OS}:step_3`),
    leftIcon: `iconPermissionGuide3${titleCase(Platform.OS)}`,
    leftIconProps: {
      icon: `iconPermissionGuide3${titleCase(Platform.OS)}`,
      size: 20,
    },
  },
  {
    title: i18next.t(`common:permission_photo_list:${Platform.OS}:step_4`),
    leftIcon: `iconPermissionGuide4${titleCase(Platform.OS)}`,
    leftIconProps: {
      icon: `iconPermissionGuide4${titleCase(Platform.OS)}`,
      size: 20,
    },
  },
];
