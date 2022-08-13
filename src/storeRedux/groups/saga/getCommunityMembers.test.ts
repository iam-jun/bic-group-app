import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {
  adminDetail,
  memberData,
  memberDetail,
} from '../../../test/mock_data/communities';

import getCommunityMembers from './getCommunityMembers';
import actions from '../actions';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import showError from '../../commonSaga/showError';

describe('get Community members', () => {
  const action = {
    type: 'test',
    payload: { communityId: '1', params: {} },
  };

  it('getCommunityMembers: should get data correctly', async () => {
    const resp = { data: { ...memberData } };

    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: true,
          offset: 0,
        },
      },
    };

    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({ loading: true }))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .put(
        actions.setCommunityMembers({
          loading: false,
          canLoadMore: false,
          offset: 11,
          community_admin: {
            data: [
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
            ],
            userCount: 5,
            name: memberData.community_admin.name,
          },
          community_member: {
            data: [
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
            ],
            userCount: 6,
            name: memberData.community_member.name,
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('getCommunityMembers: should NOT call API when canLoadMore = false', async () => {
    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: false,
          offset: 0,
          community_admin: { data: [], userCount: 0 },
          community_member: { data: [], userCount: 0 },
        },
      },
    };
    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({ loading: true }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('getCommunityMembers: should call server and throws error', async () => {
    const error = { code: 1 };
    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: true,
          offset: 0,
          community_admin: { data: [], userCount: 0 },
          community_member: { data: [], userCount: 0 },
        },
      },
    };

    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getCommunityMembers),
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
      payload: { communityId: 1, params: {}, isRefreshing: true },
    };

    const resp = { data: { ...memberData } };

    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: true,
          offset: 11,
          community_admin: {
            data: [
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
            ],
            userCount: 5,
          },
          community_member: {
            data: [
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
            ],
            userCount: 6,
          },
        },
      },
    };

    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({ loading: true }))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .put(
        actions.setCommunityMembers({
          loading: false,
          canLoadMore: false,
          offset: 11,
          community_admin: {
            data: [
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
            ],
            userCount: 5,
            name: memberData.community_admin.name,
          },
          community_member: {
            data: [
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
            ],
            userCount: 6,
            name: memberData.community_member.name,
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
