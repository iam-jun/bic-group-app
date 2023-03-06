import React from 'react';

import { act, fireEvent, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import Notification from './index';
import { mockNoti, mockNotifications, mockNotificationsWithNotType } from '~/test/mock_data/notifications';
import notificationApi from '~/api/NotificationApi';
import i18n from '~/localization';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import commonStack from '~/router/navigator/commonStack/stack';
import useModalStore from '~/store/modal';

describe('Notification Screen', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
  it('should render correctly', () => {
    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    expect(spy).toBeCalled();

    const headerTitle = wrapper.getByTestId('header.text');
    expect(headerTitle).toBeDefined();
    expect(headerTitle.props?.children).toEqual(i18n.t('tabs:notification'));

    const scrollableTabBar = wrapper.getByTestId('notification.scrollbar');
    expect(scrollableTabBar).toBeDefined();
  });

  it('should show bottom list when click header menu', () => {
    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const showBottomList = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showBottomList } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    expect(spy).toBeCalled();

    const headerMenu = wrapper.getByTestId('header.menuIcon.button');
    expect(headerMenu).toBeDefined();
    fireEvent.press(headerMenu);
    expect(showBottomList).toHaveBeenCalled();
  });

  it('should show bottom list when click item menu options', () => {
    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const showBottomList = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showBottomList } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();

    const notiMenuComponent = wrapper.queryAllByTestId('notification.menu_button');
    expect(notiMenuComponent).toBeDefined();
    fireEvent.press(notiMenuComponent[0]);
    expect(showBottomList).toHaveBeenCalled();
  });

  it('should navigate to post detail if type is undefined', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotificationsWithNotType,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(homeStack.postDetail, {
      post_id: mockNotificationsWithNotType[0].activities[0].id,
      noti_id: mockNotificationsWithNotType[0].id,
    });
  });

  it('should navigate to article detail if type is post.to_user.in_one_group and target is ARTICLE', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[4]);

    expect(navigate).toHaveBeenCalledWith(articleStack.articleDetail, {
      articleId: mockNotifications[4].activities[0].id,
    });
  });
  it('should navigate to post detail if type is post.to_user.in_one_group and target is POST', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[5]);

    expect(navigate).toHaveBeenCalledWith(homeStack.postDetail, {
      post_id: mockNotifications[5].activities[0].id,
      noti_id: mockNotifications[5].id,
    });
  });

  it('should navigate to draft if type is post.video.to_user.unsuccessful', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[1]);

    expect(navigate).toHaveBeenCalledWith(menuStack.draft);
  });

  it('should navigate to postDetail if type is comment.to_post_creator and target is POST', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[2]);

    expect(navigate).toHaveBeenCalledWith(homeStack.postDetail, {
      post_id: mockNotifications[2].activities[0].id,
      noti_id: mockNotifications[2].id,
      focus_comment: true,
    });
  });
  it('should navigate to postDetail if type is comment.to_post_creator and target is ARTICLE', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[6]);

    expect(navigate).toHaveBeenCalledWith(articleStack.articleDetail, {
      articleId: mockNotifications[6].activities[0].id,
      focusComment: true,
    });
  });

  it('should navigate to article detail if type is post.article.to_user.in_one_group', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[3]);

    expect(navigate).toHaveBeenCalledWith(articleStack.articleDetail, {
      articleId: mockNotifications[3].activities[0].id,
    });
  });
  it('should navigate to comment detail if type is comment.to_mentioned_user.in_comment', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const response = {
      code: 200,
      results: [mockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(homeStack.commentDetail, {
      postId: mockNoti.activities[0].id,
      commentId: mockNoti.activities[0].comment.id,
      notiId: mockNoti.id,
    });
  });

  it('should navigate to comment detail if type is comment.to_replied_user.in_the_same_parent_comment', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          comment: {
            id: 'test',
            child: {
              id: 'test',
            },
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'comment.to_replied_user.in_the_same_parent_comment' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(homeStack.commentDetail, {
      postId: newMockNoti.activities[0].id,
      commentId: newMockNoti.activities[0].comment.id,
      parentId: newMockNoti.activities[0].comment.id,
      notiId: newMockNoti.id,
    });
  });

  it('should navigate to community members if type is group.assigned_role.to_user', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          community: {
            id: 'test',
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.assigned_role.to_user' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(
      groupStack.communityMembers, {
        communityId: newMockNoti.activities[0].community.id,
        isMember: true,
      },
    );
  });

  it('should navigate to community members if type is group.assigned_role.to_user and has isCommunity = true in activities', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          group: {
            id: 'test',
            isCommunity: true,
            communityId: 'test',
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.assigned_role.to_user' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(
      groupStack.communityMembers, {
        communityId: newMockNoti.activities[0].group.communityId,
        isMember: true,
      },
    );
  });

  it('should navigate to group members if type is group.assigned_role.to_user and has isCommunity = false in activities', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          group: {
            id: 'test',
            isCommunity: false,
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.assigned_role.to_user' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(
      groupStack.groupMembers, {
        groupId: newMockNoti.activities[0].group.id,
        isMember: true,
      },
    );
  });

  it('should navigate to series detail if type is post.series.to_user.in_one_group', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      extra: { ...mockNoti.extra, type: 'post.series.to_user.in_one_group' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(
      seriesStack.seriesDetail, {
        seriesId: newMockNoti.activities[0].id,
      },
    );
  });

  it('should navigate to unsupport feature if type is report.user.to_user', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      extra: { ...mockNoti.extra, type: 'report.user.to_user' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(commonStack.unsupportFeature);
  });

  it('should do nothing if type is not defined', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      extra: { ...mockNoti.extra, type: 'test' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).not.toHaveBeenCalled();
  });

  it('should navigate to communityDetail if type is group.changed_privacy.to_group and has community.id', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          community: {
            id: 'test',
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.changed_privacy.to_group' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(groupStack.communityDetail, {
      communityId: newMockNoti.activities[0].community.id,
    });
  });

  it('should navigate to group detail if type is group.changed_privacy.to_group and has group.id', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          group: {
            id: 'test',
            communityId: 'test',
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.changed_privacy.to_group' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(groupStack.groupDetail, {
      groupId: newMockNoti.activities[0].group.id,
      communityId: newMockNoti.activities[0].group.communityId,
    });
  });

  it('should navigate to community members if type is group.join_group.to_admin and has community.id', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          community: {
            id: 'test',
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.join_group.to_admin' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(groupStack.communityMembers, {
      communityId: newMockNoti.activities[0].community.id,
      targetIndex: 1,
      isMember: true,
    });
  });
  it('should navigate to group members if type is group.join_group.to_admin and has group.id', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const newMockNoti = {
      ...mockNoti,
      activities: [
        {
          id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
          group: {
            id: 'test',
          },
        },
      ],
      extra: { ...mockNoti.extra, type: 'group.join_group.to_admin' },
    };
    const response = {
      code: 200,
      results: [newMockNoti],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Notification />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    const notiComponent = wrapper.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();
    fireEvent.press(notiComponent[0]);

    expect(navigate).toHaveBeenCalledWith(groupStack.groupMembers, {
      groupId: newMockNoti.activities[0].group.id,
      targetIndex: 1,
      isMember: true,
    });
  });
});
