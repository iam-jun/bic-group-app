import userApi from '~/api/UserApi';
import showToastError from '~/store/helper/showToastError';

const checkIsUserNotVerified
  = (_set, _get) => async (email: string, callback: (isExists: boolean) => void) => {
    try {
      const response = await userApi.getUserNotFoundInfo(email);
      callback(response?.data?.isExists || false);
    } catch (error: any) {
      showToastError(error);
    }
  };

export default checkIsUserNotVerified;
