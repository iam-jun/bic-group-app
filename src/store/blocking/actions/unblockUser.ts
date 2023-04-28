import groupApi from '~/api/GroupApi';
import { IBlockingUser } from '~/interfaces/IBlocking';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const unblockUser = (set, get) => async (userId: string) => {
  try {
    const { list } = get();

    const response = await groupApi.unblockUser(userId);
    if (response && response?.data) {
      const newList = list.filter((item: IBlockingUser) => item.id !== userId);
      set(
        {
          list: newList,
        },
        'unblockUserSuccess',
      );
      showToastSuccess(response);
    }
  } catch (e) {
    console.error('\x1b[31m🐣️ unblockUser error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default unblockUser;
