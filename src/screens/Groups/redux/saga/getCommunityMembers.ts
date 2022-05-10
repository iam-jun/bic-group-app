import {put, call} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {IParamGetCommunityMembers} from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/store/commonSaga/showError';

export default function* getCommunityMembers({
  payload,
}: {
  type: string;
  payload: {communityId: number; params?: IParamGetCommunityMembers};
}) {
  try {
    const {communityId, params} = payload;
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      ...params,
    });

    yield put(actions.setCommunityMembers(resp?.data));
  } catch (err: any) {
    console.log('getCommunityMembers error:', err);
    yield call(showError, err);
  }
}
