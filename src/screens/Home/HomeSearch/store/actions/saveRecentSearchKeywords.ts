/* eslint-disable @typescript-eslint/no-unused-vars */
import streamApi from '~/api/StreamApi';
import { IParamPostNewRecentSearchKeyword } from '~/interfaces/IHome';
import { IFeedSearchState } from '..';

const saveRecentSearchKeywords = (_set, get) => async (searchText: string) => {
  try {
    const recentParam: IParamPostNewRecentSearchKeyword = {
      keyword: searchText,
      target: 'post',
    };
    await streamApi.postNewRecentSearchKeyword(recentParam);

    const { actions }: IFeedSearchState = get();
    actions.getRecentSearchKeywords({
      target: 'post',
      order: 'DESC',
      limit: 10,
      showLoading: false,
    });
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saveRecentSearchKeywords error: ', e, '\x1b[0m',
    );
  }
};

export default saveRecentSearchKeywords;
