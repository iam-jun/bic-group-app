import userApi from '~/api/UserApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const blockUser = () => async (blockedUserId: string, callback?: () => void) => {
  try {
    const response = await userApi.blockUser(blockedUserId);
    if (callback) {
      callback();
      /**
       * callback exists when in User Profile
       * No callback -> in Report This Member -> don't show toast block user
       */
      showToastSuccess(response);
    }
  } catch (error) {
    console.error('blockUser error:', error);
    showToastError(error);
  }
};

export default blockUser;
