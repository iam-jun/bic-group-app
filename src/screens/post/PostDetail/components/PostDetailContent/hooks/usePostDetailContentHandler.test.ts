import { renderHook } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import React from 'react';
import usePostDetailContentHandler from './usePostDetailContentHandler';
import * as navigationHook from '~/hooks/navigation';
import usePostsStore from '~/store/entities/posts';

describe('usePostDetailContentHandler', () => {
  const props = {
    postId: 'test',
    comments: [{ id: 'test' }],
    commentId: 'test',
    focusComment: true,
    listRef: {
      current: {
        scrollToIndex: jest.fn(),
        scrollToEnd: jest.fn(),
      },
    },
    commentInputRef: {
      current: {
        focus: jest.fn(),
      },
    },
  };

  it('render correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const current = false;
    jest.spyOn(React, 'useRef').mockImplementation(() => ({ current } as any));

    usePostsStore.setState((state) => {
      state.scrollToLatestItem = true;
      return state;
    });

    const { result } = renderHook(() => usePostDetailContentHandler(props));
    act(() => {
      result.current.onPressLoadMoreCommentLevel2({});
      result.current.onPressReplySectionHeader({});
      expect(navigate).toBeCalled();

      result.current.onPressComment();
      result.current.onScroll();
      result.current.onScrollToIndexFailed('error');
      expect(props.commentInputRef.current.focus).toBeCalled();
    });
  });
});
