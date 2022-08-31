/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '../actions';
import postActions from '../../post/actions';
import groupApi from '../../../api/GroupApi';
import { groupPostData } from '../../../test/mock_data/group';
import getGroupPosts from './getGroupPosts';
import modalActions from '../../modal/actions';

describe('Get group posts saga', () => {
  const action = { type: 'test', payload: '1' };

  it('should get new group posts and cannot get more', () => {
    const state = { groups: { posts: { data: [], offset: 0 } } };
    const respones = { data: { list: [] } };

    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([[matchers.call.fn(groupApi.getGroupPosts), respones]])
      .put(postActions.addToAllPosts({ data: respones.data.list }))
      .put(groupsActions.setGroupPosts(respones.data.list))
      .put(groupsActions.setLoadingPage(false))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });

  it('should get new group posts and can still get more', () => {
    const state = { groups: { posts: { data: [], offset: 0 } } };
    const respones = { data: { list: groupPostData } };

    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupApi.getGroupPosts), respones],
      ])
      // @ts-ignore
      .put(postActions.addToAllPosts({ data: respones.data.list }))
    // @ts-ignore
      .put(groupsActions.setGroupPosts(respones.data.list))
      .put(groupsActions.getGroupPosts(action.payload))
      .put(groupsActions.setLoadingPage(false))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });

  it('should get group posts and set extra posts', () => {
    const state = { groups: { posts: { data: [{}, {}], offset: 0 } } };
    const respones = { data: { list: [] } };

    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([[matchers.call.fn(groupApi.getGroupPosts), respones]])
      .put(postActions.addToAllPosts({ data: respones.data.list }))
      .put(groupsActions.setExtraGroupPosts(respones.data.list))
      .put(groupsActions.setLoadingPage(false))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(5);
      });
  });

  it('should call server and throws error', () => {
    const state = { groups: { posts: { data: [], offset: 0 } } };

    const error = {
      code: 500,
      message: 'ERROR!!!!',
    };

    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupApi.getGroupPosts), Promise.reject(error)],
      ])
      .put(groupsActions.setLoadingPage(false))
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: { isError: true },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
