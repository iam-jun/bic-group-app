import streamApi from '~/api/StreamApi';
import { ICategory, IParamGetCategories } from '~/interfaces/IArticle';
import { IEditArticleCategoryState } from '..';
import showError from '~/store/helper/showError';

const getCategories = (set, _get) => async (_isLoadMore, params: IParamGetCategories) => {
  set((state: IEditArticleCategoryState) => {
    state.categories.loading = true;
  }, 'getCategories');
  try {
    const response = await streamApi.getCategories(params);
    set((state: IEditArticleCategoryState) => {
      state.categories.loading = false;
    }, 'getCategories');

    // todo handle load more

    if (!response?.data) {
      showError(response);
      return;
    }

    // use only name & id, another field not used yet
    const categories = response?.data?.list?.map?.(
      (category: ICategory) => ({ id: category.id, name: category.name }),
    ) || [];

    set((state: IEditArticleCategoryState) => {
      state.categories.items = categories;
    }, 'getCategories');
  } catch (e) {
    console.error('\x1b[35m🐣️ getCategories error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default getCategories;
