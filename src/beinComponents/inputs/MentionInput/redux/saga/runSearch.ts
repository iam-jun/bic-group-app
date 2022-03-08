import {call, put} from 'redux-saga/effects';
import {IObject} from '~/interfaces/common';
import {IParamSearchMentionAudiences} from '~/interfaces/IPost';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
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

    yield put(actions.setData(response?.data || []));
  } catch (e) {
    yield put(actions.setLoading(false));
    console.log('runSearch', e);
  }
}
