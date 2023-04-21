import i18next from 'i18next';
import { IGroupImageUpload, FieldNameImageUpload } from '~/interfaces/IGroup';
import useCommunityController from '~/screens/communities/store';
import showToastError from '~/store/helper/showToastError';
import useUploaderStore from '~/store/uploader';

const uploadImage = (_set, get) => async (payload: IGroupImageUpload) => {
  const {
    actions: { setLoadingAvatar, setLoadingCover, editGroupDetail },
  } = get();

  try {
    const {
      file, id, fieldName, uploadType, destination, rootGroupId,
    } = payload || {};

    const { actions } = useCommunityController.getState();

    updateLoadingImageState({
      fieldName,
      value: true,
      setLoadingAvatar,
      setLoadingCover,
    });

    await useUploaderStore.getState().actions.uploadImage({ file, uploadType });
    const { uploadedFiles } = useUploaderStore.getState();
    const idFile = uploadedFiles[file.filename]?.id;

    const editData = { id, rootGroupId, [fieldName]: idFile };
    const editFieldName
      = fieldName === FieldNameImageUpload.AVATAR ? i18next.t('common:text_avatar') : i18next.t('common:text_cover');

    if (destination === 'group') {
      await editGroupDetail(editData, editFieldName);
    } else {
      await actions.editCommunityDetail(editData, editFieldName);
    }

    updateLoadingImageState({
      fieldName: payload.fieldName,
      value: false,
      setLoadingAvatar,
      setLoadingCover,
    });
  } catch (err) {
    console.error('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
    updateLoadingImageState({
      fieldName: payload.fieldName,
      value: false,
      setLoadingAvatar,
      setLoadingCover,
    });
    showToastError(err);
  }
};

function updateLoadingImageState(payload: {
  fieldName: FieldNameImageUpload;
  value: boolean;
  setLoadingAvatar: (value: boolean) => void;
  setLoadingCover: (value: boolean) => void;
}) {
  const {
    fieldName, value, setLoadingAvatar, setLoadingCover,
  } = payload;
  if (fieldName === FieldNameImageUpload.AVATAR) {
    setLoadingAvatar(value);
  } else {
    setLoadingCover(value);
  }
}

export default uploadImage;
