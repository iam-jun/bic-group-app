import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import postDataHelper from '../../../screens/Post/helper/PostDataHelper';
import postActions from '../actions';
import { IPayloadPutMarkSeenPost } from '../../../interfaces/IPost';
import putMarkSeenPost from './putMarKSeenPost';
import { POST_DETAIL } from '../../../test/mock_data/post';
import modalActions from '../../modal/actions';

describe('Put Mark seen post Saga', () => {
  const storeData = { post: { allPosts: { [POST_DETAIL.id]: POST_DETAIL } } };
  it('should do nothing with null payload', async () => expectSaga(
    putMarkSeenPost, { type: 'test' } as any,
  )
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(0);
    }));
  it('should do nothing with invalid payload', async () => {
    const payload: IPayloadPutMarkSeenPost = {} as any;
    return expectSaga(putMarkSeenPost, { type: 'test', payload })
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(0);
      });
  });
  it('call server mark as seen success', () => {
    const payload: IPayloadPutMarkSeenPost = { postId: POST_DETAIL.id };
    const newPost: any = { ...POST_DETAIL };
    return expectSaga(putMarkSeenPost, { type: 'test', payload })
      .withState(storeData)
      .provide([
        [matchers.call.fn(postDataHelper.putMarkSeenPost), { data: true }],
      ])
      .call(postDataHelper.putMarkSeenPost, POST_DETAIL.id)
      .put(postActions.addToAllPosts(newPost))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });
  it('call server mark as seen failed', () => {
    const payload: IPayloadPutMarkSeenPost = {
      postId: POST_DETAIL.id,
    };
    return expectSaga(putMarkSeenPost, { type: 'test', payload })
      .withState(storeData)
      .provide([
        [matchers.call.fn(postDataHelper.putMarkSeenPost), { data: false }],
      ])
      .call(postDataHelper.putMarkSeenPost, POST_DETAIL.id)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
  it('call server mark as seen api exception', () => {
    const showAlert = jest.spyOn(modalActions, 'showAlert');
    const payload: IPayloadPutMarkSeenPost = {
      postId: POST_DETAIL.id,
    };
    return expectSaga(putMarkSeenPost, { type: 'test', payload })
      .withState(storeData)
      .provide([
        [
          matchers.call.fn(postDataHelper.putMarkSeenPost),
          throwError(new Error('empty data')),
        ],
      ])
      .call(postDataHelper.putMarkSeenPost, POST_DETAIL.id)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      })
      .catch(expect(showAlert).toBeCalled);
  });
});
