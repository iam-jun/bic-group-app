import i18next from 'i18next';
import { uploadApiConfig } from '~/api/UploadApi';
import { makeHttpRequest } from '~/api/apiRequest';
import {
  IGroupImageUpload,
} from '~/interfaces/IGroup';
import useCommunityController from '~/screens/communities/store';
import useGeneralInformationStore from '~/screens/groups/GeneralInformation/store';
import showToastError from '~/store/helper/showToastError';

const uploadImage = () => async (payload: IGroupImageUpload) => {
  try {
    const {
      file, id, fieldName, uploadType, destination, rootGroupId,
    } = payload || {};

    const { actions } = useCommunityController.getState();

    updateLoadingImageState(fieldName, true);

    const uploadResponse = await makeHttpRequest(uploadApiConfig.uploadImage(
      uploadType, file,
    ));

    const uploadedUrl = uploadResponse?.data?.data?.url || uploadResponse?.data?.data?.src;

    const editData = { id, rootGroupId, [fieldName]: uploadedUrl };
    const editFieldName = fieldName === 'icon'
      ? i18next.t('common:text_avatar')
      : i18next.t('common:text_cover');

    if (destination === 'group') {
      useGeneralInformationStore.getState().actions.editGroupDetail(editData, editFieldName);
    } else {
      actions.editCommunityDetail(editData, editFieldName);
    }
    updateLoadingImageState(payload.fieldName, false);
  } catch (err) {
    console.error(
      '\x1b[33m', 'uploadImage : error', err, '\x1b[0m',
    );
    updateLoadingImageState(payload.fieldName, false);
    showToastError(err);
  }
};

function updateLoadingImageState(
  fieldName: 'icon' | 'backgroundImgUrl',
  value: boolean,
) {
  const { setLoadingAvatar, setLoadingCover } = useGeneralInformationStore.getState().actions;
  if (fieldName === 'icon') {
    setLoadingAvatar(value);
  } else {
    setLoadingCover(value);
  }
}

export default uploadImage;
