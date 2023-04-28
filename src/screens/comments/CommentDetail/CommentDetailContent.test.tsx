import React from 'react';
import { act } from 'react-test-renderer';
import { cloneDeep } from 'lodash';
import { cleanup } from '@testing-library/react-native';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import { renderWithRedux } from '~/test/testUtils';
import CommentDetailContent from './CommentDetailContent';
import * as helper from './helper';
import { timeOut } from '~/utils/common';
import APIErrorCode from '~/constants/apiErrorCode';
import useModalStore from '~/store/modal';

afterEach(cleanup);

describe('CommentDetailContent component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    route: {
      params: {
        commentId: 'test',
        commentParent: 'test',
        postId: 'test',
        replyItem: 'test',
        isReported: false,
        notiId: 'test',
        parentId: 'test',
      },
    },
    showPrivacy: jest.fn(),
  };

  it('should render correctly (isReported = true)', async () => {
    const propsClone = cloneDeep(props);
    propsClone.route.params.isReported = true;

    const { postId, parentId } = props.route.params;
    useCommentsStore.setState((state) => {
      state.comments[postId] = { id: parentId, child: { meta: { hasPreviousPage: true }, list: [{ id: 'test' }] } };
      return state;
    });
    usePostsStore.setState((state) => {
      state.posts[postId] = { audience: { groups: [{ id: 'test' }] } };
      state.scrollToCommentsPosition = 'bottom';
      return state;
    });

    const rendered = renderWithRedux(<CommentDetailContent {...propsClone} />);

    const { getByTestId } = rendered;
    const placeholderComponent = getByTestId('comment_view_placeholder');
    expect(placeholderComponent).toBeDefined();

    await timeOut(300);

    const containerComponent = getByTestId('comment_detail_content');
    expect(containerComponent).toBeDefined();

    const scrollView = getByTestId('list');
    const { refreshControl, onScrollToIndexFailed } = scrollView.props;
    await act(async () => {
      refreshControl.props.onRefresh();
      onScrollToIndexFailed();
    });
  });

  it('should render correctly (isReported = false)', () => {
    renderWithRedux(<CommentDetailContent {...props} />);
  });

  it('should render CommentLevel1 is null', () => {
    const propsClone = cloneDeep(props);
    propsClone.route.params.postId = null;

    const rendered = renderWithRedux(<CommentDetailContent {...propsClone} />);
    const { queryByTestId } = rendered;
    const component = queryByTestId('comment_level_1');
    expect(component).toBeNull();
  });

  it('should render with commentErrorCode = APIErrorCode.Post.POST_PRIVACY', () => {
    usePostsStore.setState((state) => {
      state.commentErrorCode = APIErrorCode.Post.POST_PRIVACY;
      return state;
    });

    renderWithRedux(<CommentDetailContent {...props} />);

    expect(props.showPrivacy).toBeCalled();
  });

  it('should render with commentErrorCode = APIErrorCode.Post.COPIED_COMMENT_IS_DELETED', () => {
    usePostsStore.setState((state) => {
      state.commentErrorCode = APIErrorCode.Post.COPIED_COMMENT_IS_DELETED;
      return state;
    });
    const spyReplacePostDetail = jest.spyOn(helper, 'replacePostDetail');

    renderWithRedux(<CommentDetailContent {...props} />);

    expect(spyReplacePostDetail).toBeCalled();
  });

  it('should render with commentErrorCode = APIErrorCode.Post.POST_DELETED', async () => {
    usePostsStore.setState((state) => {
      state.commentErrorCode = APIErrorCode.Post.POST_DELETED;
      return state;
    });

    const showToast = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showToast = showToast;
      return state;
    });

    renderWithRedux(<CommentDetailContent {...props} />);

    expect(showToast).toBeCalled();
  });
});
