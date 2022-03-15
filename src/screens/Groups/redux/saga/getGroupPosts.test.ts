import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '~/screens/Groups/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {groupPostData} from '~/test/mock_data/group';
import getGroupPosts from './getGroupPosts';

describe('Get group posts saga', () => {
  const action = {type: 'test', payload: '1'};

  it('should get new group posts and cannot get more', () => {
    const state = {groups: {posts: {data: [], offset: 0}}};
    const result: any[] = [];

    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.getGroupPosts), result]])
      .put(postActions.addToAllPosts({data: result}))
      .put(groupsActions.setGroupPosts(result))
      .put(groupsActions.setLoadingPage(false))
      .run();
  });

  it('should get new group posts and can still get more', () => {
    const state = {groups: {posts: {data: [], offset: 0}}};

    // @ts-ignore
    return (
      expectSaga(getGroupPosts, action)
        .withState(state)
        .provide([
          [matchers.call.fn(groupsDataHelper.getGroupPosts), groupPostData],
        ])
        // @ts-ignore
        .put(postActions.addToAllPosts({data: groupPostData}))
        // @ts-ignore
        .put(groupsActions.setGroupPosts(groupPostData))
        .put(groupsActions.getGroupPosts(action.payload))
        .put(groupsActions.setLoadingPage(false))
        .run()
    );
  });

  it('should get group posts and set extra posts', () => {
    const state = {groups: {posts: {data: [{}, {}], offset: 0}}};
    const result: any[] = [];

    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.getGroupPosts), result]])
      .put(postActions.addToAllPosts({data: result}))
      .put(groupsActions.setExtraGroupPosts(result))
      .put(groupsActions.setLoadingPage(false))
      .run();
  });

  it('should call server and throws error', () => {
    const state = {groups: {posts: {data: [], offset: 0}}};

    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupsDataHelper.getGroupPosts), Promise.reject()],
      ])
      .put(groupsActions.setLoadingPage(false))
      .run();
  });
});
