import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getDraftPosts from './getDraftPosts';
import { IPayloadGetDraftPosts } from '../../../interfaces/IPost';
import streamApi from '../../../api/StreamApi';
import postActions from '../actions';
import {
  LIST_DRAFT_POST,
  LOAD_MORE_LIST_DRAFT_POST,
} from '../../../test/mock_data/draftPosts';

describe('Get Draft Posts Saga', () => {
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {
      post: {
        draftPosts: {
          posts: LIST_DRAFT_POST,
          canLoadMore: false,
          refreshing: false,
          loading: false,
        },
      },
    };
  });

  it('should do nothing when can not load more', async () => {
    const payload: IPayloadGetDraftPosts = {} as any;
    storeData.post.draftPosts.loading = true;
    return expectSaga(getDraftPosts, { type: 'test', payload })
      .withState(storeData)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should call server to refresh list draft post', () => {
    const payload: IPayloadGetDraftPosts = {} as any;
    const newData = { ...storeData.post.draftPosts, refreshing: true };
    const response = { data: LIST_DRAFT_POST, canLoadMore: false };
    return expectSaga(getDraftPosts, { type: 'test', payload })
      .withState(storeData)
      .put(postActions.setDraftPosts(newData as any))
      .provide([[matchers.call.fn(streamApi.getDraftPosts), response]])
      .put(postActions.setDraftPosts({ ...(storeData.post.draftPosts as any) }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should call server to load more list draft post', () => {
    const payload: IPayloadGetDraftPosts = { isRefresh: false } as any;
    const newStoreData = {
      post: {
        draftPosts: {
          posts: LIST_DRAFT_POST,
          canLoadMore: true,
          refreshing: false,
          loading: false,
        },
      },
    };
    const newData = {
      posts: LIST_DRAFT_POST,
      canLoadMore: true,
      refreshing: false,
      loading: true,
    };
    const response = { data: LOAD_MORE_LIST_DRAFT_POST, canLoadMore: false };
    const expectData = {
      posts: LIST_DRAFT_POST.concat(LOAD_MORE_LIST_DRAFT_POST),
      canLoadMore: false,
      refreshing: false,
      loading: false,
    };

    return expectSaga(getDraftPosts, { type: 'test', payload })
      .withState(newStoreData)
      .put(postActions.setDraftPosts(newData as any))
      .provide([[matchers.call.fn(streamApi.getDraftPosts), response]])
      .put(postActions.setDraftPosts(expectData as any))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('call server get list draft post failed', () => {
    const payload: IPayloadGetDraftPosts = {} as any;
    const newData = { ...storeData.post.draftPosts, refreshing: true };
    const error = {
      code: 10000,
      data: null,
      meta: {
        errors: [
          {
            message: 'ERROR',
            title: 'Bad Request',
          },
        ],
        message: 'Bad Request',
      },
    };

    const expectData = {
      posts: LIST_DRAFT_POST,
      canLoadMore: false,
      refreshing: false,
      loading: false,
    };
    return expectSaga(getDraftPosts, { type: 'test', payload })
      .withState(storeData)
      .put(postActions.setDraftPosts(newData as any))
      .provide([
        [matchers.call.fn(streamApi.getDraftPosts), Promise.reject(error)],
      ])
      .put(postActions.setDraftPosts(expectData as any))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
