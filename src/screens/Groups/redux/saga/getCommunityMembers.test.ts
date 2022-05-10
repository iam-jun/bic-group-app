import {memberData} from '~/test/mock_data/communities';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getCommunityMembers from './getCommunityMembers';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('get Community members', () => {
  it('should get data correctly', () => {
    const action = {
      type: 'test',
      payload: {communityId: 1},
    };

    const resp = {data: memberData};

    return (
      expectSaga(getCommunityMembers, action)
        .provide([
          [matchers.call.fn(groupsDataHelper.getCommunityMembers), resp],
        ])
        // @ts-ignore
        .put(actions.setCommunityMembers(resp.data))
        .run()
    );
  });

  it('should call server and throws error', () => {
    const error = {code: 1};
    const action = {
      type: 'test',
      payload: {communityId: 1},
    };

    return expectSaga(getCommunityMembers, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getCommunityMembers),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run();
  });
});
