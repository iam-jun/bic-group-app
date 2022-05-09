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
  payload: {
    communityId: number;
    preview_members?: boolean;
    params?: IParamGetCommunityMembers;
  };
}) {
  try {
    const {communityId, preview_members = false, params} = payload;
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: preview_members ? 10 : appConfig.recordsPerPage,
      sort: preview_members ? 'created_at:asc' : undefined,
      ...params,
    });

    if (preview_members) yield put(actions.setPreviewMembers(resp?.data));
    else yield put(actions.setCommunityMembers(resp?.data));
  } catch (err: any) {
    console.log('getCommunityMembers error:', err);
    yield call(showError, err);
  }
}
