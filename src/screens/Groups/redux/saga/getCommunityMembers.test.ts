import {memberData, previewMemberData} from '~/test/mock_data/communities';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getCommunityMembers from './getCommunityMembers';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {ICommunity} from '~/interfaces/ICommunity';
import showError from '~/store/commonSaga/showError';

describe('get Community members', () => {
  it('should get first 10 members for preview', () => {
    const action = {
      type: 'test',
      payload: {communityId: 1, preview_members: true},
    };

    const resp = {data: previewMemberData};

    return (
      expectSaga(getCommunityMembers, action)
        .provide([
          [matchers.call.fn(groupsDataHelper.getCommunityMembers), resp],
        ])
        // @ts-ignore
        .put(actions.setPreviewMembers(resp.data))
        .run()
    );
  });

  it('should get full 25 members normally', () => {
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
