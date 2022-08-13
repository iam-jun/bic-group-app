import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import approveSingleCommunityMemberRequest from './approveSingleCommunityMemberRequest';
import groupsActions from '../actions';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import showError from '../../commonSaga/showError';
import approveDeclineCode from '../../../constants/approveDeclineCode';

describe('approveSingleCommunityMemberRequest saga', () => {
  const communityId = 1;
  const requestId = 2;
  const fullName = 'Test User Name';
  const action = { type: 'string', payload: { communityId, requestId, fullName } };

  const state = {
    groups: {
      communityMemberRequests: {
        total: 3,
        ids: [1, 2, 3],
        items: { 1: {}, 2: {}, 3: {} },
      },
    },
  };

  it('should approve selected member request correctly', async () => expectSaga(approveSingleCommunityMemberRequest, action)
    .withState(state)
    .provide([
      [
        matchers.call.fn(
          groupsDataHelper.approveSingleCommunityMemberRequest,
        ),
        {},
      ],
    ])
    .put(
      groupsActions.setCommunityMemberRequests({
        total: 2,
        ids: [1, 3],
        items: { 1: {}, 3: {} } as any,
      }),
    )
    .put(
      modalActions.showHideToastMessage({
        content: `Approved user ${fullName}`,
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
        toastType: 'normal',
      }),
    )
    .put(groupsActions.getCommunityDetail({ communityId }))
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(5);
    }));

  it('should call server and server throws Canceled join request error', async () => {
    const error = { code: approveDeclineCode.CANCELED };
    return expectSaga(approveSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupsDataHelper.approveSingleCommunityMemberRequest,
          ),
          Promise.reject(error),
        ],
      ])
      .put(
        groupsActions.editCommunityMemberRequest({
          id: requestId,
          data: { isCanceled: true },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and server throws some error', async () => {
    const error = { code: 'error' };
    return expectSaga(approveSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupsDataHelper.approveSingleCommunityMemberRequest,
          ),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
