/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import {act, cleanup, wait} from '@testing-library/react-native';
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
  CHILD_COMMENT,
  LIST_CHILD_COMMENT,
  allCommentsByParentIds,
  allCommentsByParentIdsWith1ChildComment,
} from '~/test/mock_data/post';
import modalActions from '~/store/modal/actions';

afterEach(cleanup);

describe('CommentDetail screen', () => {
  const mockStore = configureStore([]);
  let storeData: any;
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {...initialState};

    storeData.auth.user = {} as any;
    storeData.post.allPosts = {} as any;
    storeData.post.loadingGetPostDetail = false;
    storeData.post.parentCommentIsDeleted = false;
    storeData.post.allCommentsByParentIds = {};
  });
  const baseCommentData = {
    actor: {
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
      fullname: 'Trần Nam Anh',
      id: 2,
      username: 'trannamanh',
    },
    child: [
      {
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
      },
    ],
    content: '.',
    createdAt: '2022-04-26T09:25:02.870Z',
    id: 490,
    media: [],
    mentions: [],
    ownerReactions: [],
    parentId: 0,
    postId: 302,
    reactionsCount: null,
    totalReply: 12,
    updatedAt: '2022-04-27T03:54:38.969Z',
  };

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

  it(`should call backend to get list child comment with `, async () => {
    const spy = jest.spyOn(postActions, 'getCommentsByPostId');

    const props = {
      route: {
        params: {
          commentData: baseCommentData,
          postId: 302,
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

  it(`should render comment list when the list has been saved to redux and replyItem !== undefine`, async () => {
    // jest.useFakeTimers();
    const spy = jest.spyOn(postActions, 'setPostDetailReplyingComment');

    const props = {
      route: {
        params: {
          commentData: {
            ...baseCommentData,
            child: allCommentsByParentIds[302][0].child,
          },
          postId: 302,
          replyItem: replyComment,
          commentParent: undefined,
        },
      },
    };

    storeData.post.allCommentsByParentIds = allCommentsByParentIds;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<CommentDetailContent {...props} />, store);

    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalled();
  });

  it(`should show popup notice this comment is not found`, async () => {
    const spy = jest.spyOn(modalActions, 'showAlert');

    const props = {
      route: {
        params: {
          commentData: {
            ...baseCommentData,
            child: allCommentsByParentIds[302][0].child,
          },
          postId: 302,
          replyItem: replyComment,
          commentParent: undefined,
        },
      },
    };

    storeData.post.allCommentsByParentIds = allCommentsByParentIds;
    const store = createTestStore(storeData);

    const wrapper = renderWithRedux(<CommentDetailContent {...props} />, store);

    storeData.post.parentCommentIsDeleted = true;
    const newStore = createTestStore(storeData);
    rerenderWithRedux(wrapper, <CommentDetailContent {...props} />, newStore);

    const flatList = wrapper.getByTestId('list');
    const {refreshControl} = flatList.props;
    act(() => {
      refreshControl.props.onRefresh();
    });

    expect(spy).toBeCalled();
  });
});
