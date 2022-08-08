import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import putEditPost, { navigate } from '~/screens/Post/redux/saga/putEditPost';
import { IPayloadPutEditPost, IPostCreatePost } from '~/interfaces/IPost';
import { POST_DETAIL } from '~/test/mock_data/post';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import modalActions from '~/store/modal/actions';
import { languages } from '~/test/testUtils';

describe('Edit Post Saga', () => {
  it('should do nothing with invalid payload', async () => {
    const payload: IPayloadPutEditPost = {} as any;
    return expectSaga(putEditPost, { type: 'test', payload })
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(0);
      });
  });

  it('call server edit post success then replace with detail', () => {
    const data: IPostCreatePost = {
      content: 'new content',
    };
    const payload: IPayloadPutEditPost = {
      id: POST_DETAIL.id,
      data,
    };
    return expectSaga(putEditPost, { type: 'test', payload })
      .provide([
        [matchers.call.fn(postDataHelper.putEditPost), { data: POST_DETAIL }],
      ])
      .put(postActions.setLoadingCreatePost(true))
      .call(postDataHelper.putEditPost, { postId: POST_DETAIL.id, data })
      .put(postActions.setLoadingCreatePost(false))
      .put(postActions.addToAllPosts({ data: POST_DETAIL } as any))
      .put(
        modalActions.showHideToastMessage({
          content: 'post:text_edit_post_success',
          props: { textProps: { useI18n: true }, type: 'success' },
        }),
      )
      .call(navigate, true, POST_DETAIL.id)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });

  it('call server edit post success then go back', () => {
    const data: IPostCreatePost = {
      content: 'new content',
    };
    const payload: IPayloadPutEditPost = {
      id: POST_DETAIL.id,
      data,
      replaceWithDetail: false,
    };
    return expectSaga(putEditPost, { type: 'test', payload })
      .provide([
        [matchers.call.fn(postDataHelper.putEditPost), { data: POST_DETAIL }],
      ])
      .put(postActions.setLoadingCreatePost(true))
      .call(postDataHelper.putEditPost, { postId: POST_DETAIL.id, data })
      .put(postActions.setLoadingCreatePost(false))
      .put(postActions.addToAllPosts({ data: POST_DETAIL } as any))
      .put(
        modalActions.showHideToastMessage({
          content: 'post:text_edit_post_success',
          props: { textProps: { useI18n: true }, type: 'success' },
        }),
      )
      .call(navigate, false, POST_DETAIL.id)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });

  it('call server edit post failed', () => {
    const payload: IPayloadPutEditPost = {
      id: POST_DETAIL.id,
      data: { ...POST_DETAIL, content: 'new content' } as any,
    };
    return expectSaga(putEditPost, { type: 'test', payload })
      .provide([
        [
          matchers.call.fn(postDataHelper.putEditPost),
          throwError(new Error('empty data')),
        ],
      ])
      .put(postActions.setLoadingCreatePost(true))
      .put(postActions.setLoadingCreatePost(false))
      .put(
        modalActions.showHideToastMessage({
          content: 'post:text_edit_post_failed',
          toastType: 'normal',
          props: {
            textProps: { useI18n: true },
            type: 'error',
            rightText: languages.common.text_retry,
            onPressRight: undefined,
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
