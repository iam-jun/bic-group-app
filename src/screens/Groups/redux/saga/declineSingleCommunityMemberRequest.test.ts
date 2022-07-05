import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '~/store/modal/actions';
import declineSingleCommunityMemberRequest from './declineSingleCommunityMemberRequest';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import approveDeclineCode from '~/constants/approveDeclineCode';

describe('declineSingleCommunityMemberRequest saga', () => {
  const communityId = 1;
  const requestId = 3;
  const fullName = 'Test User Name';
  const action = {type: 'string', payload: {communityId, requestId, fullName}};

  const state = {
    groups: {
      communityMemberRequests: {
        total: 3,
        ids: [1, 2, 3],
        items: {1: {}, 2: {}, 3: {}},
      },
    },
  };

  it('should decline selected member request correctly', async () => {
    return expectSaga(declineSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupsDataHelper.declineSingleCommunityMemberRequest,
          ),
          {},
        ],
      ])
      .put(
        groupsActions.setCommunityMemberRequests({
          total: 2,
          ids: [1, 2],
          items: {1: {}, 2: {}} as any,
        }),
      )
      .put(
        modalActions.showHideToastMessage({
          content: `Declined user ${fullName}`,
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
          toastType: 'normal',
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should call server and server throws Canceled join request error', async () => {
    const error = {code: approveDeclineCode.CANCELED};
    return expectSaga(declineSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupsDataHelper.declineSingleCommunityMemberRequest,
          ),
          Promise.reject(error),
        ],
      ])
      .put(
        groupsActions.editCommunityMemberRequest({
          id: requestId,
          data: {isCanceled: true},
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and server throws error', async () => {
    const error = {code: 'error'};
    return expectSaga(declineSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupsDataHelper.declineSingleCommunityMemberRequest,
          ),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
