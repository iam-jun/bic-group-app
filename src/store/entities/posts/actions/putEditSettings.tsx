import React from 'react';
import i18next from 'i18next';
import streamApi from '~/api/StreamApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { IPutEditSettingsParams } from '~/interfaces/IPost';
import showToastSuccess from '~/store/helper/showToastSuccess';
import ContentAlertPermissionSettings from '~/components/ContentSettings/ContentAlertPermissionSettings';
import showAlert from '~/store/helper/showAlert';
import showToastError from '~/store/helper/showToastError';

const putEditSettings
  = (_set, _get) => async (params: IPutEditSettingsParams) => {
    const {
      id, setting, audiences = [], onPreLoad, onSuccess, onFailed,
    } = params;

    try {
      if (!id) return;

      onPreLoad?.();

      const data = {
        id,
        setting,
      };
      const res = await streamApi.putEditSettings(data);

      onSuccess?.();
      showToastSuccess(res);
    } catch (error) {
      console.error('putEditSettings', error);
      onFailed?.(error);

      const errorCode = error?.code;
      if (errorCode === APIErrorCode.Post.NO_EDIT_SETTING_PERMISSION_AT_GROUP) {
        const deniedGroups = error?.meta?.errors?.groupsDenied || [];
        const lstAudienceNamesNotPermit = audiences
          .filter((audience) => deniedGroups.some((grIds) => grIds === audience?.id))
          .map((audience) => audience?.name)
          .join(', ');

        const alertPayload = {
          title: i18next.t('post:post_setting_permissions_alert:title'),
          children: (
            <ContentAlertPermissionSettings audienceListNames={lstAudienceNamesNotPermit} />
          ),
          onConfirm: null,
          cancelBtn: true,
        };
        showAlert(alertPayload);
      } else {
        showToastError(error);
      }
    }
  };

export default putEditSettings;
