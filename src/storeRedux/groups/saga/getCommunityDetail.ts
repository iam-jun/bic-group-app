import { put, select, call } from 'redux-saga/effects';

import actions from '~/storeRedux/groups/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { groupPrivacy } from '~/constants/privacyTypes';
import groupApi from '~/api/GroupApi';

export default function* getCommunityDetail({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    loadingPage?: boolean;
    showLoading?: boolean;
  };
}) {
  try {
    const { communityId, loadingPage, showLoading } = payload;
    yield put(actions.setCommunityError(false));
    if (showLoading) yield put(actions.setCommunityLoading(true));

    if (loadingPage) yield put(actions.setLoadingPage(true));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resp = yield call(
      groupApi.getCommunityDetail, communityId,
    );
    yield put(actions.setCommunityDetail(resp?.data));

    const { groups } = yield select();
    const joinStatus = groups?.communityDetail?.joinStatus;
    const isMember = joinStatus === groupJoinStatus.member;

    const privacy = groups?.communityDetail?.privacy;
    const isPublic = privacy === groupPrivacy.public || privacy === groupPrivacy.open;

    if (!isMember && !isPublic) yield put(actions.setLoadingPage(false));
  } catch (err) {
    console.error(
      'getCommunityDetail:', err,
    );
    yield put(actions.setCommunityError(true));
    yield put(actions.setCommunityLoading(false));
    yield put(actions.setLoadingPage(false));
  }
}
