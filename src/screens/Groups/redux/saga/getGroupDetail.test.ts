import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getGroupDetail from './getGroupDetail';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';

describe('Get group detail saga', () => {
  const action = {
    type: 'test',
    payload: 1,
    loadingPage: false,
  };

  it('should get group detail data with loadingPage = false successfully when user is a group member', () => {
    const resp = {
      data: {
        group: {
          privacy: 'PUBLIC',
        },
        join_status: 2,
      },
    };
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, action)
        .provide([[matchers.call.fn(groupsDataHelper.getGroupDetail), resp]])
        // @ts-ignore
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .not.put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group detail data with loadingPage = true successfully when user is a group member', () => {
    const resp = {
      data: {
        group: {
          privacy: 'PUBLIC',
        },
        join_status: 2,
      },
    };
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, { ...action, loadingPage: true })
        .put(groupsActions.setLoadingPage(true))
        .provide([[matchers.call.fn(groupsDataHelper.getGroupDetail), resp]])
        // @ts-ignore
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .not.put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group detail data successfully when user visits a public group', () => {
    const resp = {
      data: {
        group: {
          privacy: 'PUBLIC',
        },
        join_status: 1,
      },
    };
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, action)
        .provide([[matchers.call.fn(groupsDataHelper.getGroupDetail), resp]])
        // @ts-ignore
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .not.put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group detail data when user visits a private group', () => {
    const resp = {
      data: {
        group: {
          privacy: 'PRIVATE',
        },
        join_status: 1,
      },
    };
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, action)
        .provide([[matchers.call.fn(groupsDataHelper.getGroupDetail), resp]])
        // @ts-ignore
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should call server and server throws an error', () => expectSaga(getGroupDetail, action)
    .provide([
      [matchers.call.fn(groupsDataHelper.getGroupDetail), Promise.reject()],
    ])
    .put(groupsActions.setLoadingPage(false))
    .put(groupsActions.setGroupDetail(null))
    .run());
});
