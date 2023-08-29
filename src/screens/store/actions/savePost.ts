import streamApi from '~/api/StreamApi';
import { PostType } from '~/interfaces/IPost';
import useMenuStore from '~/store/entities/menus';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const savePost = (_set, _get) => async (id: string, _type: PostType) => {
  try {
    const response = await streamApi.postSaveContent(id);

    const menu = useMenuStore.getState().menus?.[id]?.data || {};
    const newMenu = {
      ...menu,
      isSave: true,
    };
    useMenuStore.getState().actions.addOrUpdateMenus(id, newMenu);

    showToastSuccess(response);
  } catch (error) {
    console.error('savePost error:', error);
    showToastError(error);
  }
};

export default savePost;
