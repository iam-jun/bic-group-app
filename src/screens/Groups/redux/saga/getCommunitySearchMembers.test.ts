import {
  adminDetail,
  memberData,
  memberDetail,
} from '~/test/mock_data/communities';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getCommunitySearchMembers from './getCommunitySearchMembers';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('get Search members', () => {
  const action = {
    type: 'test',
    payload: {communityId: 1, params: {}},
  };

  it('should get data correctly', () => {
    const resp = {data: memberData};

    const state = {
      groups: {
        communitySearchMembers: {
          loading: false,
          canLoadMore: true,
          data: [],
        },
      },
    };

    return expectSaga(getCommunitySearchMembers, action)
      .withState(state)
      .put(actions.setCommunitySearchMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .put(
        actions.setCommunitySearchMembers({
          loading: false,
          canLoadMore: false,
          data: [
            adminDetail,
            adminDetail,
            adminDetail,
            adminDetail,
            adminDetail,
            memberDetail,
            memberDetail,
            memberDetail,
            memberDetail,
            memberDetail,
            memberDetail,
          ],
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
        communitySearchMembers: {
          loading: false,
          canLoadMore: false,
          data: [],
        },
      },
    };
    return expectSaga(getCommunitySearchMembers, action)
      .withState(state)
      .put(actions.setCommunitySearchMembers({loading: true}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', () => {
    const error = {code: 1};
    const state = {
      groups: {
        communitySearchMembers: {
          loading: false,
          canLoadMore: true,
          data: [],
        },
      },
    };

    return expectSaga(getCommunitySearchMembers, action)
      .withState(state)
      .put(actions.setCommunitySearchMembers({loading: true}))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getCommunityMembers),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });

  it('should return nothing when there is no data from response', () => {
    const resp = {};

    const state = {
      groups: {
        communitySearchMembers: {
          loading: false,
          canLoadMore: true,
          data: [],
        },
      },
    };

    return expectSaga(getCommunitySearchMembers, action)
      .withState(state)
      .put(actions.setCommunitySearchMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });
});
