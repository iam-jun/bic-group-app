import {
  adminDetail,
  memberData,
  memberDetail,
} from '~/test/mock_data/communities';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getCommunityMembers, {getSearchMembers} from './getCommunityMembers';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('get Community members', () => {
  const action = {
    type: 'test',
    payload: {communityId: 1, params: {}},
  };

  it('getCommunityMembers: should get data correctly', () => {
    const resp = {data: memberData};

    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: true,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .put(
        actions.setCommunityMembers({
          loading: false,
          canLoadMore: false,
          community_admin: {
            data: [
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
            ],
            user_count: 5,
          },
          member: {
            data: [
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
            ],
            user_count: 6,
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('getCommunityMembers: should NOT call API when canLoadMore = false', () => {
    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: false,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };
    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({loading: true}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('getCommunityMembers: should return nothing when there is no data from response', () => {
    const resp = {};

    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: true,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('getCommunityMembers: should call server and throws error', () => {
    const error = {code: 1};
    const state = {
      groups: {
        communityMembers: {
          loading: false,
          canLoadMore: true,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getCommunityMembers, action)
      .withState(state)
      .put(actions.setCommunityMembers({loading: true}))
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

  /**
   * getSearchMembers test saga
   */

  it('getSearchMembers: should get data correctly', () => {
    const resp = {data: memberData};

    const state = {
      groups: {
        searchMembers: {
          loading: false,
          canLoadMore: true,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getSearchMembers, action)
      .withState(state)
      .put(actions.setSearchMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .put(
        actions.setSearchMembers({
          loading: false,
          canLoadMore: false,
          community_admin: {
            data: [
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
              adminDetail,
            ],
            user_count: 5,
          },
          member: {
            data: [
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
              memberDetail,
            ],
            user_count: 6,
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('getSearchMembers: should NOT call API when canLoadMore = false', () => {
    const state = {
      groups: {
        searchMembers: {
          loading: false,
          canLoadMore: false,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };
    return expectSaga(getSearchMembers, action)
      .withState(state)
      .put(actions.setSearchMembers({loading: true}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('getSearchMembers: should call server and throws error', () => {
    const error = {code: 1};
    const state = {
      groups: {
        searchMembers: {
          loading: false,
          canLoadMore: true,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getSearchMembers, action)
      .withState(state)
      .put(actions.setSearchMembers({loading: true}))
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

  it('getSearchMembers: should return nothing when there is no data from response', () => {
    const resp = {};

    const state = {
      groups: {
        searchMembers: {
          loading: false,
          canLoadMore: true,
          community_admin: {data: [], user_count: 0},
          member: {data: [], user_count: 0},
        },
      },
    };

    return expectSaga(getSearchMembers, action)
      .withState(state)
      .put(actions.setSearchMembers({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunityMembers), resp]])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });
});
