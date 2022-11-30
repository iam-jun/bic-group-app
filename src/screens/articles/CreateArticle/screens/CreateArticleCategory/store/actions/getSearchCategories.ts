import streamApi from '~/api/StreamApi';
import { ICategory } from '~/interfaces/IArticle';
import { ICreateArticleCategoryState } from '..';
import showError from '~/store/helper/showError';

const getSearchCategories = (set, _get) => async (key: string) => {
  set((state: ICreateArticleCategoryState) => {
    state.search.loading = true;
    state.search.key = key;
  }, 'getSearchCategories');
  try {
    const response = await streamApi.getCategories({ name: key, limit: 25 });

    // use only name & id, another field not used yet
    const categories = response?.data?.list?.map?.(
      (category: ICategory) => ({ id: category.id, name: category.name }),
    ) || [];

    set((state: ICreateArticleCategoryState) => {
      state.search.items = categories;
      state.search.loading = false;
    }, 'getSearchCategories');
  } catch (e) {
    console.error('\x1b[35m🐣️ getSearchCategories error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default getSearchCategories;
