/* eslint-disable @typescript-eslint/no-unused-vars */
import streamApi from '~/api/StreamApi';
import { IRecentSearchTarget } from '~/interfaces/IHome';
import { IFeedSearchState } from '..';

const deleteRecentSearchAll = (_set, get) => async (target: IRecentSearchTarget) => {
  try {
    await streamApi.deleteCleanRecentSearch(target);
    const { actions }: IFeedSearchState = get();
    actions.getRecentSearchKeywords({
      target: 'post',
      order: 'DESC',
      limit: 10,
      showLoading: false,
    });
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ deleteRecentSearchAll error: ', e, '\x1b[0m',
    );
  }
};

export default deleteRecentSearchAll;
