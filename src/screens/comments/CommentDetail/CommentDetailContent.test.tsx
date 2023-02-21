import React from 'react';
import { act } from 'react-test-renderer';
import { cloneDeep } from 'lodash';
import { cleanup } from '@testing-library/react-native';
import APIErrorCode from '~/constants/apiErrorCode';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import initialState from '~/storeRedux/initialState';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import CommentDetailContent from './CommentDetailContent';
import * as helper from './helper';
import { timeOut } from '~/utils/common';

afterEach(cleanup);

describe('CommentDetailContent component', () => {
  const mockStore = configureStore([]);
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.post.commentErrorCode = '';
    storeData.post.scrollToCommentsPosition = null;
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
      return state;
    });

    storeData.post.scrollToCommentsPosition = { position: 'bottom' };
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<CommentDetailContent {...propsClone} />, store);

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
    const store = mockStore(storeData);
    renderWithRedux(<CommentDetailContent {...props} />, store);
  });

  it('should render CommentLevel1 is null', () => {
    const propsClone = cloneDeep(props);
    propsClone.route.params.postId = null;

    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommentDetailContent {...propsClone} />, store);
    const { queryByTestId } = rendered;
    const component = queryByTestId('comment_level_1');
    expect(component).toBeNull();
  });

  it('should render with commentErrorCode = APIErrorCode.Post.POST_PRIVACY', () => {
    storeData.post.commentErrorCode = APIErrorCode.Post.POST_PRIVACY;
    const store = mockStore(storeData);

    renderWithRedux(<CommentDetailContent {...props} />, store);

    expect(props.showPrivacy).toBeCalled();
  });

  it('should render with commentErrorCode = APIErrorCode.Post.COPIED_COMMENT_IS_DELETED', () => {
    storeData.post.commentErrorCode = APIErrorCode.Post.COPIED_COMMENT_IS_DELETED;
    const store = mockStore(storeData);

    const spyReplacePostDetail = jest.spyOn(helper, 'replacePostDetail');

    renderWithRedux(<CommentDetailContent {...props} />, store);

    expect(spyReplacePostDetail).toBeCalled();
  });

  it('should render with commentErrorCode = APIErrorCode.Post.POST_DELETED', async () => {
    storeData.post.commentErrorCode = APIErrorCode.Post.POST_DELETED;
    const store = mockStore(storeData);

    renderWithRedux(<CommentDetailContent {...props} />, store);
  });
});
