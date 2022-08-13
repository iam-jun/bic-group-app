import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { adminDetail, memberData, memberDetail } from '../../../test/mock_data/group';

import getGroupSearchMembers from './getGroupSearchMembers';
import actions from '../actions';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import showError from '../../commonSaga/showError';

describe('getGroupSearchMembers saga', () => {
  const action = {
    type: 'test',
    payload: { groupId: 1, params: {} },
  };

  it('should get data correctly', async () => {
    const resp = { data: { ...memberData } };

    const state = {
      groups: {
        groupSearchMembers: {
          loading: false,
          canLoadMore: true,
          data: [],
        },
      },
    };

    return expectSaga(getGroupSearchMembers, action)
      .withState(state)
      .put(actions.setGroupSearchMembers({ loading: true }))
      .provide([[matchers.call.fn(groupsDataHelper.getGroupMembers), resp]])
      .put(
        actions.setGroupSearchMembers({
          loading: false,
          canLoadMore: false,
          data: [
            adminDetail,
            adminDetail,
            adminDetail,
            memberDetail,
            memberDetail,
            memberDetail,
            memberDetail,
          ],
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should NOT call API when canLoadMore = false', async () => {
    const state = {
      groups: {
        groupSearchMembers: {
          loading: false,
          canLoadMore: false,
          data: [],
        },
      },
    };
    return expectSaga(getGroupSearchMembers, action)
      .withState(state)
      .put(actions.setGroupSearchMembers({ loading: true }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', async () => {
    const error = { code: 'error' };
    const state = {
      groups: {
        groupSearchMembers: {
          loading: false,
          canLoadMore: true,
          data: [],
        },
      },
    };

    return expectSaga(getGroupSearchMembers, action)
      .withState(state)
      .put(actions.setGroupSearchMembers({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getGroupMembers),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });
});
