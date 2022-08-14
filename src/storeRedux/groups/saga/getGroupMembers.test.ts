import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { adminDetail, memberData, memberDetail } from '../../../test/mock_data/group';

import getGroupMembers from './getGroupMembers';
import actions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';

describe('getGroupMembers saga', () => {
  const action = {
    type: 'test',
    payload: { groupId: '1', params: {} },
  };

  it('should get data correctly', async () => {
    const resp = { data: { ...memberData } };

    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: true,
          offset: 0,
          groupAdmin: { data: [], userCount: 0 },
          groupMember: { data: [], userCount: 0 },
        },
      },
    };

    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({ loading: true }))
      .provide([[matchers.call.fn(groupApi.getGroupMembers), resp]])
      .put(
        actions.setGroupMembers({
          loading: false,
          canLoadMore: false,
          offset: 7,
          groupAdmin: {
            data: [adminDetail, adminDetail, adminDetail],
            userCount: 3,
            name: 'Admin',
          },
          groupMember: {
            data: [memberDetail, memberDetail, memberDetail, memberDetail],
            userCount: 4,
            name: 'Member',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should NOT call API when canLoadMore = false', () => {
    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: false,
          offset: 0,
          groupAdmin: { data: [], userCount: 0 },
          groupMember: { data: [], userCount: 0 },
        },
      },
    };
    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({ loading: true }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', () => {
    const error = { code: 'error' };
    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: true,
          offset: 0,
          groupAdmin: { data: [], userCount: 0 },
          groupMember: { data: [], userCount: 0 },
        },
      },
    };

    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupApi.getGroupMembers),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });

  it('should refresh data correctly', async () => {
    const action = {
      type: 'test',
      payload: { groupId: '1', params: {}, isRefreshing: true },
    };

    const resp = { data: { ...memberData } };
    const state = {
      groups: {
        groupMembers: {
          loading: false,
          canLoadMore: false,
          offset: 7,
          groupAdmin: {
            data: [adminDetail, adminDetail, adminDetail],
            userCount: 3,
            name: 'Admin',
          },
          groupMember: {
            data: [memberDetail, memberDetail, memberDetail, memberDetail],
            userCount: 4,
            name: 'Member',
          },
        },
      },
    };

    return expectSaga(getGroupMembers, action)
      .withState(state)
      .put(actions.setGroupMembers({ loading: true }))
      .provide([[matchers.call.fn(groupApi.getGroupMembers), resp]])
      .put(
        actions.setGroupMembers({
          loading: false,
          canLoadMore: false,
          offset: 7,
          groupAdmin: {
            data: [adminDetail, adminDetail, adminDetail],
            userCount: 3,
            name: 'Admin',
          },
          groupMember: {
            data: [memberDetail, memberDetail, memberDetail, memberDetail],
            userCount: 4,
            name: 'Member',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
