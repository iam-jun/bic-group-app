import { expectSaga } from 'redux-saga-test-plan';
import mergeExtraGroupPosts from './mergeExtraGroupPosts';
import groupsActions from '../actions';

describe('Merge extra group posts saga', () => {
  const action = { type: 'test', payload: '' };

  it('should get more posts data', () => {
    const state = { groups: { posts: { loading: false, canLoadMore: true } } };
    return expectSaga(mergeExtraGroupPosts, action)
      .withState(state)
      .put(groupsActions.getGroupPosts(action.payload))
      .run();
  });

  it('should not get more posts data', () => {
    const state = { groups: { posts: { loading: false, canLoadMore: false } } };
    return expectSaga(mergeExtraGroupPosts, action).withState(state).run();
  });
});
