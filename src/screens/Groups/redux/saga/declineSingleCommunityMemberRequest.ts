import {call, put, select} from 'redux-saga/effects';
import i18next from 'i18next';

import groupsActions from '~/screens/Groups/redux/actions';
import modalActions from '~/store/modal/actions';
import {IToastMessage} from '~/interfaces/common';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import approveDeclineCode from '~/constants/approveDeclineCode';

export default function* declineSingleCommunityMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    requestId: string;
    fullName: string;
  };
}) {
  const {communityId, requestId, fullName} = payload;
  try {
    yield call(
      groupsDataHelper.declineSingleCommunityMemberRequest,
      communityId,
      requestId,
    );

    // Update data state
    const {groups} = yield select();
    const {total, ids, items} = groups.communityMemberRequests;
    const requestItems = {...items};
    delete requestItems[requestId];
    yield put(
      groupsActions.setCommunityMemberRequests({
        total: total - 1,
        ids: ids.filter((item: string) => item !== requestId),
        items: requestItems,
      }),
    );

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declined_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.log('declineSingleCommunityMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANCELED) {
      yield put(
        groupsActions.editCommunityMemberRequest({
          id: requestId,
          data: {isCanceled: true},
        }),
      );
      return;
    }

    yield call(showError, err);
  }
}
