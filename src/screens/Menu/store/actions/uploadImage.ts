import showToastError from '~/store/helper/showToastError';
import IMenuController from '../Interface';
import { IUserImageUpload } from '~/interfaces/IEditUser';
import { makeHttpRequest } from '~/api/apiRequest';
import { uploadApiConfig } from '~/api/UploadApi';

const uploadImage = (_set, get) => async (payload: IUserImageUpload, callback: () => void) => {
  const { actions }: IMenuController = get();
  try {
    const {
      file, id, fieldName, uploadType,
    } = payload;

    const response = await makeHttpRequest(uploadApiConfig.uploadImage(
      uploadType, file,
    ));

    const data = response?.data?.data;
    const imageUrl = data?.url || data?.src;
    if (!!imageUrl) {
      actions.editMyProfile({
        data: { id, [fieldName]: imageUrl },
      });
    }
    if (callback) callback();
  } catch (error) {
    showToastError(error);
  }
};

export default uploadImage;
