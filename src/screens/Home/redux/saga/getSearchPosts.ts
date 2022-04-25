import {
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword,
  IPayloadGetSearchPosts,
} from '~/interfaces/IHome';
import {call, put, select} from 'redux-saga/effects';
import homeActions from '~/screens/Home/redux/actions';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import postActions from '~/screens/Post/redux/actions';

export default function* getSearchPosts({
  payload,
}: {
  payload: IPayloadGetSearchPosts;
  type: string;
}): any {
  const {searchText, actors, startDate, endDate, isLoadMore} = payload || {};
  try {
    let data: any[] = [];
    const state = yield select(state => state?.home?.newsfeedSearch);
    const {searchResults, totalResult, loadingResult} = state || {};
    const params: IParamGetSearchPost = {content: searchText};

    if (loadingResult || !searchText?.trim?.()) {
      console.log(`\x1b[36m🐣️ saga getSearchPosts loading result\x1b[0m`);
      return;
    }

    if (isLoadMore) {
      if (
        totalResult > 0 &&
        searchResults?.length &&
        totalResult > searchResults.length
      ) {
        data = searchResults;
        params.offset = data.length;
      } else {
        console.log(`\x1b[36m🐣️ saga getSearchPosts cant load more\x1b[0m`);
        return;
      }
    }

    yield put(homeActions.setNewsfeedSearch({loadingResult: true}));

    if (actors) {
      params.actors = actors;
    }
    if (startDate) {
      params.startTime = startDate;
    }
    if (endDate) {
      params.endTime = endDate;
    }
    const response = yield call(homeDataHelper.getSearchPost, params);
    data = data.concat(response?.list);
    yield put(postActions.addToAllPosts({data, handleComment: false}));
    yield put(
      homeActions.setNewsfeedSearch({
        loadingResult: false,
        searchResults: data,
        totalResult: response?.total,
      }),
    );

    //save keyword to recent search
    if (!isLoadMore) {
      const recentParam: IParamPostNewRecentSearchKeyword = {
        keyword: searchText,
        target: 'post',
      };
      yield call(homeDataHelper.postNewRecentSearchKeyword, recentParam);
      yield put(
        homeActions.getRecentSearchKeywords({
          target: 'post',
          order: 'DESC',
          limit: 10,
          showLoading: false,
        }),
      );
    }
  } catch (e) {
    yield put(homeActions.setNewsfeedSearch({loadingResult: false}));
    console.log(`\x1b[31m🐣️ saga getSearchPosts error: `, e, `\x1b[0m`);
  }
}
