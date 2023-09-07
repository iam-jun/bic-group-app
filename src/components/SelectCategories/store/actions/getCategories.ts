import streamApi from '~/api/StreamApi';
import { ICategory, IParamGetCategories } from '~/interfaces/IArticle';
import { ISelectCategoriesState } from '..';
import showToastError from '~/store/helper/showToastError';

const getCategories = (set, get) => async (isLoadMore) => {
  try {
    const categoryData = get().categories || {};
    const params: IParamGetCategories = { offset: 0, limit: 25 };

    if (isLoadMore && !categoryData.hasNextPage) {
      return;
    }

    set((state: ISelectCategoriesState) => {
      state.categories.loading = true;
    }, 'getCategories');

    if (isLoadMore) {
      params.offset = categoryData?.items?.length;
    }

    const response = await streamApi.getCategories(params);

    if (response?.data) {
      // use only name & id, another field not used yet
      const listResult = response?.data?.list?.map?.(
        (category: ICategory) => ({ id: category.id, name: category.name }),
      ) || [];
      const hasNextPage = response?.data?.meta?.hasNextPage;

      const categories = isLoadMore ? [...categoryData.items, ...listResult] : listResult;

      set((state: ISelectCategoriesState) => {
        state.categories.loading = false;
        state.categories.items = categories;
        state.categories.hasNextPage = hasNextPage;
      }, 'getCategories');
    } else {
      set((state: ISelectCategoriesState) => {
        state.categories.loading = false;
      }, 'getCategories');
      showToastError(response);
    }
  } catch (e) {
    console.error('\x1b[35m🐣️ getCategories error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getCategories;
