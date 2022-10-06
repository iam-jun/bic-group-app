import { call, put, select } from 'redux-saga/effects';
import {
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword,
  IPayloadGetSearchPosts,
} from '~/interfaces/IHome';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import homeActions from '~/storeRedux/home/actions';
import streamApi from '~/api/StreamApi';

export default function* getSearchPosts({
  payload,
}: {
  payload: IPayloadGetSearchPosts;
  type: string;
}): any {
  const {
    searchText, actors, startDate, endDate, isLoadMore,
  } = payload || {};
  try {
    let data: any[] = [];
    const state = yield select((state) => state?.home?.newsfeedSearch);
    const { searchResults, totalResult, loadingResult } = state || {};
    const params: IParamGetSearchPost = { contentSearch: searchText };

    if (loadingResult || !searchText?.trim?.()) {
      console.warn('\x1b[36m🐣️ saga getSearchPosts loading result\x1b[0m');
      return;
    }

    if (isLoadMore) {
      if (
        totalResult > 0
        && searchResults?.length
        && totalResult > searchResults.length
      ) {
        data = searchResults;
        params.offset = data.length;
      } else {
        console.warn('\x1b[36m🐣️ saga getSearchPosts cant load more\x1b[0m');
        return;
      }
    }

    yield put(homeActions.setNewsfeedSearch({ loadingResult: true }));

    if (actors) {
      params.actors = actors;
    }
    if (startDate) {
      params.startTime = startDate;
    }
    if (endDate) {
      params.endTime = endDate;
    }
    const response = yield call(
      streamApi.getSearchPost, params,
    );
    data = data.concat(response?.list);
    usePostsStore.getState().actions.addToPosts({ data, handleComment: false } as IPayloadAddToAllPost);

    yield put(homeActions.setNewsfeedSearch({
      loadingResult: false,
      searchResults: data,
      totalResult: response?.total,
    }));

    // save keyword to recent search
    if (!isLoadMore) {
      const recentParam: IParamPostNewRecentSearchKeyword = {
        keyword: searchText,
        target: 'post',
      };
      yield call(
        streamApi.postNewRecentSearchKeyword, recentParam,
      );
      yield put(homeActions.getRecentSearchKeywords({
        target: 'post',
        order: 'DESC',
        limit: 10,
        showLoading: false,
      }));
    }
  } catch (e) {
    yield put(homeActions.setNewsfeedSearch({ loadingResult: false }));
    console.error(
      '\x1b[31m🐣️ saga getSearchPosts error: ', e, '\x1b[0m',
    );
  }
}
