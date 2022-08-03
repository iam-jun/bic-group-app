import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import i18next from 'i18next';

import groupsDataHelper from '../../helper/GroupsDataHelper';
import cancelJoinCommunity from './cancelJoinCommunity';
import groupsActions from '../actions';
import modalActions from '~/store/modal/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';
import approveDeclineCode from '~/constants/approveDeclineCode';

describe('cancelJoinCommuniity saga', () => {
  const communityId = "1";
  const communityName = 'Community Name Test';
  const action = {
    type: 'test',
    payload: { communityId, communityName },
  };

  it('should cancel join request to Private community correctly', () => {
    return expectSaga(cancelJoinCommunity, action)
      .provide([[matchers.call.fn(groupsDataHelper.cancelJoinCommunity), {}]])
      .put(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus: groupJoinStatus.visitor },
        }),
      )
      .put(groupsActions.getCommunityDetail({ communityId }))
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t(
            'groups:text_cancel_join_community',
          )} ${communityName}`,
          props: {
            type: 'success',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
  it('should cancel join request and server throws error', () => {
    const error = { code: 'error' };
    return expectSaga(cancelJoinCommunity, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.cancelJoinCommunity),
          Promise.reject(error),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should cancel join request and server throws approved error', () => {
    const error = { code: approveDeclineCode.APPROVED };
    return expectSaga(cancelJoinCommunity, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.cancelJoinCommunity),
          Promise.reject(error),
        ],
      ])
      .put(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus: groupJoinStatus.member },
        }),
      )
      .put(groupsActions.getCommunityDetail({ communityId, loadingPage: true }))
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
