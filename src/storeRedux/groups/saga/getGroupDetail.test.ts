import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getGroupDetail from './getGroupDetail';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';

describe('Get group detail saga', () => {
  const action = {
    groupId: '1',
    loadingPage: false,
  };

  const resp = {
    data: {
      group: {
        id: '1',
        name: 'test',
        privacy: 'PUBLIC',
      },
      joinStatus: 2,
    },
  };

  it('should get group detail data with loadingPage = false successfully when user is a group member', () => {
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, action as any)
        .provide([[matchers.call.fn(groupApi.getGroupDetail), resp]])
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .not.put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group detail data with loadingPage = true successfully when user is a group member', () => {
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, { ...action, loadingPage: true } as any)
        .put(groupsActions.setLoadingPage(true))
        .provide([[matchers.call.fn(groupApi.getGroupDetail), resp]])
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .not.put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group detail data successfully when user visits a public group', () => {
    const _resp = {
      ...resp,
      joinStatus: 2,
    };
    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, action as any)
        .provide([[matchers.call.fn(groupApi.getGroupDetail), _resp]])
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .not.put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group detail data when user visits a private group', () => {
    const _resp = {
      ...resp,
      joinStatus: 2,
    };

    const state = {
      groups: {
        groupDetail: resp.data,
      },
    };

    return (
      expectSaga(getGroupDetail, action as any)
        .provide([[matchers.call.fn(groupApi.getGroupDetail), _resp]])
        .put(groupsActions.setGroupDetail(resp.data))
        .withState(state)
        .put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should call server and server throws an error', () => expectSaga(getGroupDetail, action as any)
    .provide([
      [matchers.call.fn(groupApi.getGroupDetail), Promise.reject()],
    ])
    .put(groupsActions.setLoadingPage(false))
    .put(groupsActions.setGroupDetail(null))
    .run());
});
