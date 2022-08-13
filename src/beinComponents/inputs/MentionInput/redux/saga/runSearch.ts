import { call, put, select } from 'redux-saga/effects';
import { IObject } from '~/interfaces/common';
import { IParamSearchMentionAudiences } from '~/interfaces/IPost';
import postDataHelper from '~/api/PostDataHelper';
import actions from '../actions';

export default function* runSearch({
  payload,
}: {
  type: string;
  payload: IParamSearchMentionAudiences;
}) {
  try {
    const response: IObject<any> = yield call(
      postDataHelper.getSearchMentionAudiences,
      payload,
    );
    const fullContent: string = (yield select((state) => state?.mentionInput?.fullContent)) || '';
    if (fullContent) {
      yield put(actions.setData(response?.data || []));
    } else {
      yield put(actions.setData([]));
    }
  } catch (e) {
    yield put(actions.setLoading(false));
    console.error('runSearch', e);
  }
}
