import React, { RefObject } from 'react';
import {
  CommonActions,
  NavigationContainerRef,
  NavigationState,
  PartialState,
  RouteProp,
  StackActions,
} from '@react-navigation/native';

import { isEmpty, isNumber } from 'lodash';
import * as SplashScreen from 'expo-splash-screen';
import { IObject } from '~/interfaces/common';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import seriesStack from './navigator/MainStack/stacks/series/stack';
import articleStack from './navigator/MainStack/stacks/articleStack/stack';
import { TargetType } from '~/interfaces/IPost';
import homeStack from './navigator/MainStack/stacks/homeStack/stack';
import menuStack from './navigator/MainStack/stacks/menuStack/stack';
import mainStack from './navigator/MainStack/stack';
import { ContentType, InvitationTargetType } from '~/interfaces/INotification';
import notiStack from './navigator/MainStack/stacks/notiStack/stack';
import { USER_TABS } from '~/screens/Menu/UserProfile';
import { USER_TABS_TYPES } from '~/screens/Menu/UserProfile/constants';
import useAuthController from '~/screens/auth/store';
import groupStack from './navigator/MainStack/stacks/groupStack/stack';
import { rootNavigationRef } from './refs';

export const isNavigationRefReady: any = React.createRef();
export interface Props {
  current?: NavigationContainerRef<any> | null;
  canGoBack: boolean | undefined;
  navigate: (name: string, params?: IObject<unknown>) => void;
  push: (name: string, params?: IObject<unknown>) => void;
  replace: (name: string, params?: IObject<unknown>) => void;
  replaceListScreenByNewScreen: (replaces: string[], newScreen: RouteProp<any>) => void;
  goBack: () => void;
  popToTop: () => void;
  nestedNavigate: (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ) => void;
  setParams: (params: any) => void;
  pop: (index: number) => void;
}

export const withNavigation = (navigationRef: RefObject<NavigationContainerRef<any>> | null | undefined): Props => {
  const canGoBack = navigationRef?.current?.canGoBack();

  const navigate = (
    name: string, params?: IObject<unknown>,
  ): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.navigate(
        name, params,
      );
    } else {
      setTimeout(
        () => navigationRef?.current?.navigate(
          name, params,
        ), 100,
      );
    }
  };

  const push = (
    name: string, params?: IObject<unknown>,
  ): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.dispatch(StackActions.push(
        name, params,
      ));
    } else {
      setTimeout(
        () => navigationRef?.current?.dispatch(StackActions.push(
          name, params,
        )),
        100,
      );
    }
  };

  const replace = (
    name: string, params?: IObject<unknown>,
  ): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.dispatch(StackActions.replace(
        name, params,
      ));
    } else {
      setTimeout(
        () => navigationRef?.current?.dispatch(StackActions.replace(
          name, params,
        )),
        100,
      );
    }
  };

  const replaceListScreenByNewScreen = (
    replaces: string[],
    newScreen: RouteProp<any>,
  ) => {
    navigationRef?.current?.dispatch((state) => {
      const newRoutes = state.routes.filter(
        (route) => !replaces.includes(route.name),
      );
      const indexScreenExisted = newRoutes.findIndex(
        (route) => route.name === newScreen.name,
      );
      if (indexScreenExisted !== -1) {
        newRoutes[indexScreenExisted] = {
          ...newRoutes[indexScreenExisted],
          params: newScreen.params,
        };
      } else {
        newRoutes.push(newScreen);
      }

      return CommonActions.reset({
        ...state,
        routes: newRoutes,
        index: indexScreenExisted !== -1 ? indexScreenExisted : newRoutes.length - 1,
      });
    });
  };

  const goBack = () => {
    navigationRef?.current?.goBack?.();
  };

  const popToTop = () => {
    navigationRef?.current?.dispatch(StackActions.popToTop());
  };

  const pop = (index: number) => {
    navigationRef?.current?.dispatch(StackActions.pop(index));
  };

  const nestedNavigate = (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ): void => {
    navigationRef?.current?.navigate(
      parentName, {
        screen: name,
        params,
      },
    );
  };

  const setParams = (params: any) => {
    navigationRef?.current?.setParams(params);
  };

  return {
    current: navigationRef?.current,
    canGoBack,
    navigate,
    push,
    replace,
    replaceListScreenByNewScreen,
    goBack,
    popToTop,
    nestedNavigate,
    setParams,
    pop,
  };
};

export const getActiveRouteState = (route?: NavigationState | PartialState<NavigationState>): string | null => {
  if (!route || !isNumber(route?.index)) return null;

  const currentRoute = route.routes[route.index];
  if (!currentRoute.state) return route.routes[route.index].name;

  const childActiveRoute = route.routes[route.index].state;
  return getActiveRouteState(childActiveRoute);
};

export const getScreenAndParams = (data: {
  type: string;
  target: string | any;
  postId: string;
  commentId: string;
  childCommentId: string;
  communityId: string;
  groupId: string;
  contentId: string;
  contentType: string;
  userId: string;
  seriesId: string;
  duration: number;
  startAt: string;
  notificationId: string;
}) => {
  if (isEmpty(data)) {
    return null;
  }

  const {
    type,
    target,
    postId = 0,
    commentId = 0,
    childCommentId = null,
    communityId = null,
    groupId = null,
    contentId = null,
    contentType = '',
    userId = '',
    seriesId = '',
    duration = 0,
    startAt = '',
    notificationId = '',
  } = data || {};

  if (duration) {
    return {
      screen: notiStack.notiMaintenancePage,
      params: { maintenanceInfo: { startAt, duration } },
    };
  }

  if (type === undefined) {
    return null;
  }

  switch (type) {
    case NOTIFICATION_TYPE.POST_TO_USER_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.POST_TO_USER_IN_MULTIPLE_GROUPS:
    case NOTIFICATION_TYPE.POST_IMPORTANT_TO_USER_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.POST_IMPORTANT_TO_USER_IN_MULTIPLE_GROUPS:
    case NOTIFICATION_TYPE.POST_TO_MENTIONED_USER_IN_POST_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.POST_TO_MENTIONED_USER_IN_POST_IN_MULTIPLE_GROUPS:
    case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL:
    case NOTIFICATION_TYPE.POST_IMPORTANT_TO_MENTIONED_USER_IN_POST_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.POST_IMPORTANT_TO_MENTIONED_USER_IN_POST_IN_MULTIPLE_GROUPS:
    case NOTIFICATION_TYPE.REACTION_TO_POST_CREATOR:
    case NOTIFICATION_TYPE.REACTION_TO_POST_CREATOR_AGGREGATED:
      return navigatePostDetail({ postId, target });

    case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL:
      return {
        screen: menuStack.yourContent,
        params: { initTab: 0 },
      };
    case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR:
    case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR_AGGREGATED:
    case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST:
    case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST_AGGREGATED:
    case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST:
    case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST_AGGREGATED:
      return navigatePostDetailWithCommentId({ postId, target, commentId });

    case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_COMMENT:
    case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT:
    case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT_AGGREGATED:
    case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR:
    case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR_AGGREGATED:
    case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR:
    case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR_AGGREGATED:
      return {
        screen: 'comment-detail',
        params: {
          postId,
          commentId: childCommentId || commentId,
          parentId: commentId,
          target: target === TargetType.COMMENT_ARTICLE ? TargetType.ARTICLE : TargetType.POST,
        },
      };

    case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT:
    case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_PUSH:
    case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_AGGREGATED:
      return {
        screen: 'comment-detail',
        params: {
          postId,
          commentId: childCommentId,
          parentId: commentId,
          target: target === TargetType.COMMENT_ARTICLE ? TargetType.ARTICLE : TargetType.POST,
        },
      };

    case NOTIFICATION_TYPE.GROUP_ASSIGNED_ROLE_TO_USER:
    case NOTIFICATION_TYPE.GROUP_DEMOTED_ROLE_TO_USER:
      return navigateGroupMembers({ groupId, communityId });

    case NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP:
    case NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER:
    case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED:
    case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED:
    case NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.LEAVE_COMMUNITY_TO_USER:
    case NOTIFICATION_TYPE.LEAVE_GROUP_TO_USER:
      return navigateGroupDetail({ groupId, communityId });

    case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN:
    case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED:
      return {
        screen: communityId ? 'community-pending-members' : 'group-pending-members',
        params: {
          id: communityId || groupId || '',
        },
      };
    case NOTIFICATION_TYPE.POST_SERIES_TO_USER_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.POST_SERIES_TO_USER_IN_MULTIPLE_GROUPS:
    case NOTIFICATION_TYPE.ADD_ARTICLE_TO_USER:
    case NOTIFICATION_TYPE.ADD_POST_TO_USER:
      return {
        screen: seriesStack.seriesDetail,
        params: {
          seriesId: postId,
        },
      };
    case NOTIFICATION_TYPE.POST_ARTICLE_TO_USER_IN_ONE_GROUP:
    case NOTIFICATION_TYPE.POST_ARTICLE_TO_USER_IN_MULTIPLE_GROUPS:
      return {
        screen: articleStack.articleDetail,
        params: {
          articleId: postId,
        },
      };
    case NOTIFICATION_TYPE.REMOVE_ARTICLE_TO_USER:
    case NOTIFICATION_TYPE.REMOVE_ARTICLE_TO_CREATOR:
      return {
        screen: articleStack.articleDetail,
        params: {
          articleId: contentId,
        },
      };
    case NOTIFICATION_TYPE.REMOVE_POST_TO_USER:
    case NOTIFICATION_TYPE.REMOVE_POST_TO_CREATOR:
      return {
        screen: homeStack.postDetail,
        params: { post_id: contentId },
      };
    case NOTIFICATION_TYPE.DELETE_SERIES_TO_USER:
      return navigatePostDetailWithContentType({ contentType, contentId });

    case NOTIFICATION_TYPE.LEAVE_MULTIPLE_GROUP_TO_USER:
      return null;
    case NOTIFICATION_TYPE.APPROVED_KYC:
      return { screen: mainStack.userProfile, params: { userId } };
    case NOTIFICATION_TYPE.ADD_CONTENT_TO_USER:
    case NOTIFICATION_TYPE.ADD_CONTENT_TO_USER_IN_MULTIPLE_GROUPS:
    case NOTIFICATION_TYPE.SERIES_POST_ITEM_CHANGED:
    case NOTIFICATION_TYPE.SERIES_ARTICLE_ITEM_CHANGED:
      return {
        screen: seriesStack.seriesDetail,
        params: {
          seriesId,
        },
      };

    case NOTIFICATION_TYPE.CHANGE_LOGS:
      return { screen: notiStack.notiChangeLogsPage, params: { id: notificationId } };

    case NOTIFICATION_TYPE.CHANGE_USER_BADGE_COLLECTION: {
      const { userId } = useAuthController.getState().authUser;
      const targetIndex = USER_TABS.findIndex(
        (item: { id: string; text: string }) => item.id === USER_TABS_TYPES.USER_BADGE_COLLECTION,
      );
      return { screen: mainStack.userProfile, params: { userId, targetIndex } };
    }
    case NOTIFICATION_TYPE.GROUP_INVITATION: {
      const communityId = target?.communityId || '';
      const groupId = target?.id || '';
      const targetType = target?.type || '';
      if (targetType === InvitationTargetType.COMMUNITY && !!communityId) {
        return navigateGroupDetail({ groupId, communityId });
      }
      if (targetType === InvitationTargetType.GROUP && !!groupId && communityId) {
        return navigateGroupDetail({ groupId, communityId });
      }
      break;
    }
    case NOTIFICATION_TYPE.GROUP_INVITATION_FEEDBACK: {
      const communityId = target?.communityId || '';
      const groupId = target?.id || '';
      const targetType = target?.type || '';
      if (targetType === InvitationTargetType.COMMUNITY && !!communityId) {
        return navigateGroupMembers({ groupId, communityId });
      }

      if (targetType === InvitationTargetType.GROUP && !!groupId) {
        return navigateGroupMembers({ groupId, communityId });
      }
      break;
    }

    default:
      console.warn(`Notification type ${type} have not implemented yet`);
      return { screen: homeStack.postDetail, params: { post_id: postId } };
  }
};

const routerHelper = {
  withNavigation,
};

const navigatePostDetail = ({ postId, target }) => {
  if (target === TargetType.ARTICLE) {
    return {
      screen: articleStack.articleDetail,
      params: { articleId: postId },
    };
  }
  return {
    screen: homeStack.postDetail,
    params: { post_id: postId },
  };
};

const navigatePostDetailWithCommentId = ({ postId, target, commentId }) => {
  if (target === TargetType.COMMENT_ARTICLE || target === TargetType.ARTICLE) {
    return {
      screen: articleStack.articleDetail,
      params: { articleId: postId, commentId },
    };
  }
  return {
    screen: homeStack.postDetail,
    params: { post_id: postId, comment_id: commentId },
  };
};

const navigateGroupMembers = ({ groupId, communityId }) => {
  if (!!communityId) {
    return {
      screen: 'community-members',
      params: {
        communityId,
      },
    };
  }
  if (!!groupId) {
    return {
      screen: 'group-members',
      params: {
        groupId,
      },
    };
  }
};

const navigateGroupDetail = ({ groupId, communityId }) => {
  if (!!groupId) {
    return {
      screen: groupStack.groupDetail,
      params: {
        groupId,
        communityId: communityId || '',
      },
    };
  }
  if (!!communityId) {
    return {
      screen: groupStack.communityDetail,
      params: {
        communityId,
      },
    };
  }
};

const navigatePostDetailWithContentType = ({ contentType, contentId }) => {
  if (contentType === ContentType.post) {
    return {
      screen: homeStack.postDetail,
      params: { post_id: contentId },
    };
  }
  if (contentType === ContentType.article) {
    return {
      screen: articleStack.articleDetail,
      params: {
        articleId: contentId,
      },
    };
  }
  return null;
};

export const hideSplashScreen = async () => {
  await SplashScreen.hideAsync();
};

const rootNavigation = withNavigation?.(rootNavigationRef);

export const navigateToGroupDetail = (params: { groupId: string; communityId?: string }) => {
  const { groupId, communityId } = params;
  return rootNavigation.push(mainStack.groupDetail, { groupId, communityId });
};

export const navigateToCommunityDetail = (params: { communityId: string }) => {
  const { communityId } = params;
  return rootNavigation.push(mainStack.communityDetail, { communityId });
};

export default routerHelper;
