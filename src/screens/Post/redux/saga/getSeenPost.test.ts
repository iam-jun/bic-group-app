import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import {IGetSeenPostListSheet} from '~/interfaces/IPost';
import getSeenPost from '~/screens/Post/redux/saga/getSeenPost';
import {POST_DETAIL, SEEN_POST} from '~/test/mock_data/post';
import {throwError} from 'redux-saga-test-plan/providers';
import modalActions from '~/store/modal/actions';

describe('Get Seen Post Saga', () => {
  const storeData = {post: {seenPostList: {data: [], canLoadMore: true}}};
  it('should do nothing with invalid payload', async () => {
    const payload: IGetSeenPostListSheet = {} as any;
    return expectSaga(getSeenPost, {type: 'test', payload})
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });
  it('call server get as seen post success', () => {
    // @ts-ignore
    const payload: IGetSeenPostListSheet = {postId: '25', offset: 0};
    const params = {postId: '25', offset: 0};
    const seenPost: any = {...SEEN_POST};
    return expectSaga(getSeenPost, {type: 'test', payload})
      .withState(storeData)
      .provide([
        [
          matchers.call.fn(postDataHelper.getSeenList),
          {data: {list: seenPost, meta: {total: 1, hasNextPage: true}}},
        ],
      ])
      .call(postDataHelper.getSeenList, params)
      .put(
        postActions.setSeenPost({
          data: [SEEN_POST],
          total: 1,
          canLoadMore: true,
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });
  it('when do not load more seen post', () => {
    // @ts-ignore
    const storeData_2 = {post: {seenPostList: {data: [], canLoadMore: false}}};
    const payload: IGetSeenPostListSheet = {
      postId: '25',
      offset: 0,
    };
    return expectSaga(getSeenPost, {type: 'test', payload})
      .withState(storeData_2)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
  it('call server get as seen post failed', () => {
    // @ts-ignore
    const payload: IGetSeenPostListSheet = {postId: '25', offset: 0};
    const params = {postId: '25', offset: 0};
    return expectSaga(getSeenPost, {type: 'test', payload})
      .withState(storeData)
      .provide([[matchers.call.fn(postDataHelper.getSeenList), null]])
      .call(postDataHelper.getSeenList, params)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });
});
