import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsActions from '~/screens/Groups/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import { groupPostData } from '~/test/mock_data/group';
import getGroupPosts from './getGroupPosts';
import modalActions from '~/store/modal/actions';

describe('Get group posts saga', () => {
  const action = { type: 'test', payload: '1' };

  it('should get new group posts and cannot get more', () => {
    const state = { groups: { posts: { data: [], offset: 0 } } };
    const respones = { data: { list: [] } };

    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.getGroupPosts), respones]])
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

    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupsDataHelper.getGroupPosts), respones],
      ])
      .put(postActions.addToAllPosts({ data: respones.data.list }))
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

    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.getGroupPosts), respones]])
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
    // @ts-ignore
    return expectSaga(getGroupPosts, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupsDataHelper.getGroupPosts), Promise.reject(error)],
      ])
      .put(groupsActions.setLoadingPage(false))
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
