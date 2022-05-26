import {adminDetail, memberData, memberDetail} from '~/test/mock_data/group';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getGroupMembers from './getGroupMembers';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('getGroupMembers saga', () => {
  const action = {
    type: 'test',
    payload: {groupId: 1, params: {}},
  };

  it('should get data correctly', async () => {
    const resp = {...memberData};

    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: true,
          group_admin: {data: [], user_count: 0},
          group_member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getGroupMembers), resp]])
      .put(
        actions.setGroupMembers({
          loading: false,
          canLoadMore: false,
          group_admin: {
            data: [adminDetail, adminDetail, adminDetail],
            user_count: 3,
          },
          group_member: {
            data: [memberDetail, memberDetail, memberDetail, memberDetail],
            user_count: 4,
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should NOT call API when canLoadMore = false', () => {
    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: false,
          group_admin: {data: [], user_count: 0},
          group_member: {data: [], user_count: 0},
        },
      },
    };
    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({loading: true}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', () => {
    const error = {code: 'error'};
    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: true,
          group_admin: {data: [], user_count: 0},
          group_member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({loading: true}))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getGroupMembers),
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
