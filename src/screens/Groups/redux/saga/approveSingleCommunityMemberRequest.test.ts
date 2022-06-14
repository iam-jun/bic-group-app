import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '~/store/modal/actions';
import approveSingleCommunityMemberRequest from './approveSingleCommunityMemberRequest';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('approveSingleCommunityMemberRequest saga', () => {
  const communityId = 1;
  const requestId = 1;
  const fullName = 'Test User Name';
  const action = {type: 'string', payload: {communityId, requestId, fullName}};

  const state = {
    groups: {
      communityMemberRequests: {
        total: 1,
        ids: [1],
        items: {1: {}},
      },
    },
  };

  it('should approve selected member request correctly', async () => {
    return expectSaga(approveSingleCommunityMemberRequest, action)
      .withState(state)
      .put(
        groupsActions.setCommunityMemberRequests({
          total: 0,
          ids: [],
          items: {},
        }),
      )
      .provide([
        [
          matchers.call.fn(
            groupsDataHelper.approveSingleCommunityMemberRequest,
          ),
          {},
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: `Approved user ${fullName}`,
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
          toastType: 'normal',
        }),
      )
      .put(groupsActions.getCommunityDetail({communityId}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });

  it('should call server and server throws error', async () => {
    const error = {code: 'error'};
    return expectSaga(approveSingleCommunityMemberRequest, action)
      .withState(state)
      .put(
        groupsActions.setCommunityMemberRequests({
          total: 0,
          ids: [],
          items: {},
        }),
      )
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
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });
});
