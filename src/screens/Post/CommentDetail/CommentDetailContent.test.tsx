/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import {act, cleanup} from '@testing-library/react-native';
import initialState from '~/store/initialState';
import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
  rerenderWithRedux,
} from '~/test/testUtils';

import CommentDetailContent from './CommentDetailContent';
import postActions from '../redux/actions';
import {
  allCommentsByParentIds,
  allCommentsByParentIdsWith1ChildComment,
  baseCommentData,
  POST_DETAIL_3,
} from '~/test/mock_data/post';
import modalActions from '~/store/modal/actions';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

afterEach(cleanup);

describe('CommentDetail screen', () => {
  const mockStore = configureStore([]);
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {...initialState};

    storeData.auth.user = {} as any;
    storeData.post.allPosts = {} as any;
    storeData.post.loadingGetPostDetail = false;
    storeData.post.allCommentsByParentIds = {};
    storeData.post.allPosts = {[POST_DETAIL_3.id]: POST_DETAIL_3};
    storeData.post.commentErrorCode = '';
  });

  const replyComment = {
    totalReply: 0,
    ownerReactions: [],
    id: 505,
    actor: {
      id: 58,
      username: 'thuquyen',
      fullname: 'Nguyen Thi Thu Quyền',
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
    },
    parentId: 490,
    postId: 302,
    content: '9',
    createdAt: '2022-04-27T03:54:38.962Z',
    updatedAt: '2022-04-27T03:54:38.962Z',
    media: [],
    reactionsCount: null,
    mentions: [],
    child: [],
  };

  it(`should call backend to get comment detail with `, async () => {
    const spy = jest.spyOn(postActions, 'getCommentDetail');

    const props = {
      route: {
        params: {
          commentId: baseCommentData.id,
          postId: baseCommentData.postId,
          replyItem: undefined,
          commentParent: undefined,
        },
      },
    };

    storeData.post.allCommentsByParentIds =
      allCommentsByParentIdsWith1ChildComment;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<CommentDetailContent {...props} />, store);

    expect(spy).toBeCalledTimes(1);
  });

  it(`should call showPrivacy prop when commentErrorCode = api.forbidden`, async () => {
    const showPrivacy = jest.fn();
    const props = {
      route: {
        params: {
          commentId: baseCommentData.id,
          postId: baseCommentData.postId,
          replyItem: undefined,
          commentParent: undefined,
        },
      },
    };

    storeData.post.commentErrorCode = API_ERROR_CODE.POST.postPrivacy;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <CommentDetailContent showPrivacy={showPrivacy} {...props} />,
      store,
    );

    expect(showPrivacy).toBeCalledWith(true);
  });

  it(`should replace screen post detail when this comment is deleted `, async () => {
    const replace = jest.fn();
    const rootNavigation = {replace};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const props = {
      route: {
        params: {
          commentId: baseCommentData.id,
          postId: baseCommentData.postId,
          replyItem: undefined,
          commentParent: undefined,
        },
      },
    };

    storeData.post.commentErrorCode =
      API_ERROR_CODE.POST.copiedCommentIsDeleted;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<CommentDetailContent {...props} />, store);

    expect(replace).toBeCalledWith(homeStack.postDetail, {
      post_id: baseCommentData.postId,
    });
  });

  /**
   * Can not run this test case bc can not test saga have callback function in screen, please try this late
   */
  // it(`should show popup notice this comment is not found`, async () => {
  //   const spy = jest.spyOn(modalActions, 'showAlert');

  //   const props = {
  //     route: {
  //       params: {
  //         commentId: baseCommentData.id,
  //         postId: baseCommentData.postId,
  //         replyItem: {...replyComment, id: 504},
  //         commentParent: undefined,
  //       },
  //     },
  //   };

  //   storeData.post.allCommentsByParentIds = allCommentsByParentIds;
  //   const store = createTestStore(storeData);

  //   const wrapper = renderWithRedux(<CommentDetailContent {...props} />, store);
  // expect(wrapper.toJSON()).toMatchSnapshot();
  // storeData.post.commentErrorCode = API_ERROR_CODE.POST.commentDeleted;
  // const newStore = createTestStore(storeData);
  // rerenderWithRedux(wrapper, <CommentDetailContent {...props} />, newStore);

  // const flatList = wrapper.getByTestId('list');
  // const {refreshControl} = flatList.props;
  // act(() => {
  //   refreshControl.props.onRefresh();
  // });

  // expect(spy).toBeCalled();
  // });

  //  it(`should call api get comment detail when the user pull refresh`, async () => {
  //      const spy = jest.spyOn(postActions, 'getCommentDetail');

  //    const props = {
  //      route: {
  //        params: {
  //          commentId: baseCommentData.id,
  //          postId: baseCommentData.postId,
  //          replyItem: {...replyComment, id: 504},
  //          commentParent: undefined,
  //        },
  //      },
  //    };

  //    storeData.post.allCommentsByParentIds = allCommentsByParentIds;
  //    const store = createTestStore(storeData);

  //    const wrapper = renderWithRedux(
  //      <CommentDetailContent {...props} />,
  //      store,
  //    );
  //    const flatList = wrapper.getByTestId('list');

  //    const {refreshControl} = flatList.props;
  //    act(() => {
  //      refreshControl.props.onRefresh();
  //    });

  //    expect(spy).toBeCalled();
  //  });
});
