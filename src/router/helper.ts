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
import { IObject } from '~/interfaces/common';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { parseSafe } from '~/utils/common';
import seriesStack from './navigator/MainStack/stacks/series/stack';
import articleStack from './navigator/MainStack/stacks/articleStack/stack';
import { TargetType } from '~/interfaces/IPost';
import homeStack from './navigator/MainStack/stacks/homeStack/stack';
import menuStack from './navigator/MainStack/stacks/menuStack/stack';
import { ContentType } from '~/interfaces/INotification';

export const isNavigationRefReady: any = React.createRef();

export interface Props {
  current?: NavigationContainerRef<any> | null;
  canGoBack: boolean | undefined;
  navigate: (name: string, params?: IObject<unknown>) => void;
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
    replace,
    replaceListScreenByNewScreen,
    goBack,
    popToTop,
    nestedNavigate,
    setParams,
  };
};

export const getActiveRouteState = (route?: NavigationState | PartialState<NavigationState>): string | null => {
  if (!route || !isNumber(route?.index)) return null;

  const currentRoute = route.routes[route.index];
  if (!currentRoute.state) return route.routes[route.index].name;

  const childActiveRoute = route.routes[route.index].state;
  return getActiveRouteState(childActiveRoute);
};

export const getScreenAndParams = (data: string|undefined):{screen: string; params: any} | null => {
  const newData = typeof data === 'string' ? parseSafe(data) : {};
  if (!isEmpty(newData)) {
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
    } = newData;
    if (type !== undefined) {
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

        case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL:
          return {
            screen: menuStack.yourContent,
            params: {},
          };
        case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR:
        case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST:
        case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST_AGGREGATED:
          if (target === TargetType.COMMENT_ARTICLE || target === TargetType.ARTICLE) {
            return {
              screen: articleStack.articleDetail,
              params: { articleId: postId, focusComment: true },
            };
          }
          return {
            screen: homeStack.postDetail,
            params: { post_id: postId, focus_comment: true },
          };

        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_COMMENT:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR:
        case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR_AGGREGATED:
        case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR:
        case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR_AGGREGATED:
          return {
            screen: 'comment-detail',
            params: { postId, commentId },
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
            },
          };
        case NOTIFICATION_TYPE.GROUP_ASSIGNED_ROLE_TO_USER:
        case NOTIFICATION_TYPE.GROUP_DEMOTED_ROLE_TO_USER:
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

          break;
        case NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP:
        case NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER:
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED:
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED:
        case NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP:
        case NOTIFICATION_TYPE.LEAVE_COMMUNITY_TO_USER:
        case NOTIFICATION_TYPE.LEAVE_GROUP_TO_USER:
          if (!!groupId) {
            return {
              screen: 'group-detail',
              params: {
                groupId,
                communityId: communityId || '',
              },
            };
          }
          if (!!communityId) {
            return {
              screen: 'community-detail',
              params: {
                communityId,
              },
            };
          }
          break;
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN:
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED:
          return {
            screen: !!communityId
              ? 'community-pending-members'
              : 'group-pending-members',
            params: {
              id: !!communityId ? communityId : groupId || '',
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
        case NOTIFICATION_TYPE.LEAVE_MULTIPLE_GROUP_TO_USER:
          return null;
        default:
          console.warn(`Notification type ${type} have not implemented yet`);
          return { screen: homeStack.postDetail, params: { post_id: postId } };
      }
    }
  }
  return null;
};

const routerHelper = {
  withNavigation,
};

export default routerHelper;
