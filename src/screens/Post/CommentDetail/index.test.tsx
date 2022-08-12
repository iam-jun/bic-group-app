import React from 'react';

import i18next from 'i18next';
import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CommentDetail from '.';
import { baseCommentData, POST_DETAIL_3 } from '~/test/mock_data/post';
import MockedNavigator from '~/test/MockedNavigator';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import API_ERROR_CODE from '~/constants/apiErrorCode';

describe('Comment Detail screen', () => {
  const mockStore = configureStore([]);
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.post.commentErrorCode = '';
    storeData.auth.user = {} as any;
    storeData.post.allPosts = {} as any;
    storeData.post.loadingGetPostDetail = false;
    storeData.post.parentCommentIsDeleted = false;
    storeData.post.allCommentsByParentIds = {};
    storeData.post.allPosts = { [POST_DETAIL_3.id]: POST_DETAIL_3 };
  });

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

  it('should render correctly title', () => {
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <CommentDetail {...props} />} />,
      store,
    );
    const headerTitle = wrapper.getByTestId('header.text');
    expect(headerTitle).toBeDefined();

    expect(headerTitle.props?.children).toBe(i18next.t('post:label_comment'));
  });

  it('should go back to News Feed when click button in the screen the user does not have permission', () => {
    const replace = jest.fn();
    const rootNavigation = { replace };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    storeData.post.commentErrorCode = API_ERROR_CODE.POST.postPrivacy;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<CommentDetail {...props} />, store);
    const buttonComponent = wrapper.getByTestId(
      'comment_detail.back_to_news_feed',
    );

    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);
    expect(replace).toBeCalledWith(homeStack.newsfeed);
  });
});
