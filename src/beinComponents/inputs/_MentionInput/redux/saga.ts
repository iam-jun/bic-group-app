import {AxiosResponse} from 'axios';
import {put, takeLatest} from 'redux-saga/effects';
import {IParamSearchMentionAudiences} from '~/interfaces/IPost';
import {postApiConfig} from '~/screens/Post/helper/PostDataHelper';
import {makeHttpRequest} from '~/services/httpApiRequest';
import actions from './actions';
import types from './types';

export default function* menuSaga() {
  yield takeLatest(types.RUN_SEARCH, runSearch);
}

function* runSearch({
  payload,
}: {
  type: string;
  payload: IParamSearchMentionAudiences;
}) {
  try {
    const response: AxiosResponse = yield makeHttpRequest(
      postApiConfig.getSearchMentionAudiences(payload),
    );
    if (response.data?.data) yield put(actions.setData(response.data?.data));
  } catch (e) {
    console.log('runSearch', e);
  }
}
