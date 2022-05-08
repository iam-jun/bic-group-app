import {put, call} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {IParamGetCommunityMembers} from '~/interfaces/ICommunity';

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
    const resp = yield call(
      groupsDataHelper.getCommunityMembers,
      communityId,
      params,
    );

    if (preview_members) yield put(actions.setPreviewMembers(resp?.data));
    else yield put(actions.setCommunityMembers(resp?.data));
  } catch (err: any) {
    console.log('getCommunityMembers error:', err);
  }
}
