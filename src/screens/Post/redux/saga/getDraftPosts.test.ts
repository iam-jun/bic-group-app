import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import getDraftPosts from './getDraftPosts';
import {IPayloadGetDraftPosts} from '~/interfaces/IPost';
import {POST_DETAIL} from '~/test/mock_data/post';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import modalActions from '~/store/modal/actions';
import {configureStore} from '~/test/testUtils';
import {throwError} from 'redux-saga-test-plan/providers';
import initialState from '~/store/initialState';
import {LIST_DRAFT_POST} from '~/test/mock_data/draftPosts';

describe('Get Draft Posts Saga', () => {
  const storeData = {
    post: {
      draftPosts: {
        posts: LIST_DRAFT_POST,
        canLoadMore: false,
        refreshing: false,
        loading: false,
      },
    },
  };

  it('should do nothing when can not load more', async () => {
    const payload: IPayloadGetDraftPosts = {} as any;
    storeData.post.draftPosts.loading = true;
    return expectSaga(getDraftPosts, {type: 'test', payload})
      .withState(storeData)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should call server to refresh list draft post', () => {
    const payload: IPayloadGetDraftPosts = {} as any;
    const newData = {...storeData.post.draftPosts, refreshing: true};
    const response = {data: LIST_DRAFT_POST, canLoadMore: false};
    return expectSaga(getDraftPosts, {type: 'test', payload})
      .withState(storeData)
      .put(postActions.setDraftPosts(newData as any))
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .put(postActions.setDraftPosts({...(storeData.post.draftPosts as any)}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  // it('call server edit post success then go back', () => {
  //   const data: IPostCreatePost = {
  //     data: {...POST_DETAIL.object.data, content: 'new content'},
  //   };
  //   const payload: IPayloadPutEditPost = {
  //     id: POST_DETAIL.id,
  //     data,
  //     replaceWithDetail: false,
  //   };
  //   return expectSaga(putEditPost, {type: 'test', payload})
  //     .provide([
  //       [matchers.call.fn(postDataHelper.putEditPost), {data: POST_DETAIL}],
  //     ])
  //     .put(postActions.setLoadingCreatePost(true))
  //     .call(postDataHelper.putEditPost, {postId: POST_DETAIL.id, data})
  //     .put(postActions.setLoadingCreatePost(false))
  //     .put(postActions.addToAllPosts({data: POST_DETAIL}))
  //     .put(
  //       modalActions.showHideToastMessage({
  //         content: 'post:text_edit_post_success',
  //         props: {textProps: {useI18n: true}, type: 'success'},
  //       }),
  //     )
  //     .call(navigate, false, POST_DETAIL.id)
  //     .run()
  //     .then(({allEffects}: any) => {
  //       expect(allEffects?.length).toEqual(6);
  //     });
  // });

  // it('call server edit post failed', () => {
  //   const payload: IPayloadPutEditPost = {
  //     id: POST_DETAIL.id,
  //     data: {
  //       data: {...POST_DETAIL.object.data, content: 'new content'},
  //     },
  //   };
  //   return expectSaga(putEditPost, {type: 'test', payload})
  //     .provide([
  //       [
  //         matchers.call.fn(postDataHelper.putEditPost),
  //         throwError(new Error('empty data')),
  //       ],
  //     ])
  //     .put(postActions.setLoadingCreatePost(true))
  //     .put(postActions.setLoadingCreatePost(false))
  //     .put(
  //       modalActions.showHideToastMessage({
  //         content: languages.post.text_edit_post_failed,
  //         toastType: 'normal',
  //         props: {
  //           textProps: {useI18n: true},
  //           type: 'error',
  //           rightText: languages.common.text_retry,
  //           onPressRight: undefined,
  //         },
  //       }),
  //     )
  //     .run()
  //     .then(({allEffects}: any) => {
  //       expect(allEffects?.length).toEqual(4);
  //     });
  // });
});
