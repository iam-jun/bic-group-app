import { renderHook } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import React from 'react';
import initialState from '~/storeRedux/initialState';
import { POST_DETAIL } from '~/test/mock_data/post';
import { createTestStore, getHookReduxWrapper } from '~/test/testUtils';
import usePostDetailContentHandler from './usePostDetailContentHandler';
import * as navigationHook from '~/hooks/navigation';

describe('usePostDetailContentHandler', () => {
  const props = {
    postId: POST_DETAIL.id,
    comments: 'test',
    sectionData: [
      {
        comment: {
          id: 'test',
        },
      },
    ],
    focusComment: 'test',
    listRef: {
      current: {
        scrollToLocation: jest.fn(),
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

    const scrollToLocation = jest.fn();
    const current = { scrollToLocation };
    jest.spyOn(React, 'useRef').mockImplementation(() => ({ current } as any));

    const stateData = { ...initialState };
    // stateData.post.scrollToLatestItem = { parentCommentId: 'test' };
    const store = createTestStore(stateData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostDetailContentHandler(props), { wrapper });
    act(() => {
      result.current.onPressLoadMoreCommentLevel2({});
      result.current.onPressReplySectionHeader({});
      result.current.onPressReplyCommentItem({}, {});
      expect(navigate).toBeCalled();

      result.current.onPressComment();
      result.current.onScroll();
      result.current.onScrollToIndexFailed();
      result.current.onLayout();
      expect(props.commentInputRef.current.focus).toBeCalled();
      expect(props.listRef.current.scrollToLocation).toBeCalled();
    });
  });
});
