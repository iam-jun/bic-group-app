import streamApi from '~/api/StreamApi';
import { ISearchState } from '..';

const deleteRecentSearchById = (set, get) => async (id: string) => {
  try {
    await streamApi.deleteRecentSearchById(id);
    const { actions }: ISearchState = get();
    actions.getRecentSearchKeywords({
      target: 'post',
      order: 'DESC',
      limit: 10,
      showLoading: false,
    });
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ deleteRecentSearchById error: ', e, '\x1b[0m',
    );
  }
};

export default deleteRecentSearchById;
