import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import postDataHelper from '../../../screens/Post/helper/PostDataHelper';
import postActions from '../actions';
import { IPayloadPutMarkAsRead } from '../../../interfaces/IPost';
import putMarkAsRead from './putMarkAsRead';
import { POST_DETAIL } from '../../../test/mock_data/post';

describe('Put Mark as read Saga', () => {
  const storeData = { post: { allPosts: { [POST_DETAIL.id]: POST_DETAIL } } };

  it('should do nothing with invalid payload', async () => {
    const payload: IPayloadPutMarkAsRead = {} as any;
    return expectSaga(putMarkAsRead, { type: 'test', payload })
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(0);
      });
  });

  it('call server mark as read success', () => {
    const payload: IPayloadPutMarkAsRead = {
      postId: POST_DETAIL.id,
    };
    const newPost: any = {
      ...POST_DETAIL,
      markedReadPost: true,
      markedReadSuccess: true,
    };
    return expectSaga(putMarkAsRead, { type: 'test', payload })
      .withState(storeData)
      .provide([[matchers.call.fn(postDataHelper.putMarkAsRead), { data: true }]])
      .call(postDataHelper.putMarkAsRead, POST_DETAIL.id)
      .put(postActions.addToAllPosts(newPost))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('call server mark as read failed', () => {
    const payload: IPayloadPutMarkAsRead = {
      postId: POST_DETAIL.id,
    };
    return expectSaga(putMarkAsRead, { type: 'test', payload })
      .withState(storeData)
      .provide([
        [matchers.call.fn(postDataHelper.putMarkAsRead), { data: false }],
      ])
      .call(postDataHelper.putMarkAsRead, POST_DETAIL.id)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('call server mark as read api exception', () => {
    const payload: IPayloadPutMarkAsRead = {
      postId: POST_DETAIL.id,
    };
    return expectSaga(putMarkAsRead, { type: 'test', payload })
      .withState(storeData)
      .provide([
        [
          matchers.call.fn(postDataHelper.putMarkAsRead),
          throwError(new Error('empty data')),
        ],
      ])
      .call(postDataHelper.putMarkAsRead, POST_DETAIL.id)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
