import React, {RefObject} from 'react';
import {
  NavigationContainerRef,
  NavigationState,
  PartialState,
  StackActions,
} from '@react-navigation/native';

import {IObject} from '~/interfaces/common';
import {isEmpty, isNumber} from 'lodash';
import {NOTIFICATION_TYPE} from '~/constants/notificationTypes';

export const isNavigationRefReady = React.createRef();

export interface Props {
  current?: NavigationContainerRef | null;
  canGoBack: boolean | undefined;
  navigate: (name: string, params?: IObject<unknown>) => void;
  replace: (name: string, params?: IObject<unknown>) => void;
  goBack: () => void;
  popToTop: () => void;
  nestedNavigate: (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ) => void;
  setParams: (params: any) => void;
}

export const withNavigation = (
  navigationRef: RefObject<NavigationContainerRef> | null | undefined,
): Props => {
  const canGoBack = navigationRef?.current?.canGoBack();

  const navigate = (name: string, params?: IObject<unknown>): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.navigate(name, params);
    } else {
      setTimeout(() => navigationRef?.current?.navigate(name, params), 100);
    }
  };

  const replace = (name: string, params?: IObject<unknown>): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.dispatch(StackActions.replace(name, params));
    } else {
      setTimeout(
        () =>
          navigationRef?.current?.dispatch(StackActions.replace(name, params)),
        100,
      );
    }
  };

  const goBack = () => {
    navigationRef?.current?.canGoBack() && navigationRef?.current?.goBack();
  };

  const popToTop = () => {
    navigationRef?.current?.dispatch(StackActions.popToTop());
  };

  const nestedNavigate = (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ): void => {
    navigationRef?.current?.navigate(parentName, {
      screen: name,
      params: params,
    });
  };

  const setParams = (params: any) => {
    navigationRef?.current?.setParams(params);
  };

  return {
    current: navigationRef?.current,
    canGoBack,
    navigate,
    replace,
    goBack,
    popToTop,
    nestedNavigate,
    setParams,
  };
};

export const getActiveRouteState = function (
  route?: NavigationState | PartialState<NavigationState>,
): string | null {
  if (!route || !isNumber(route?.index)) return null;

  const currentRoute = route.routes[route.index];
  if (!currentRoute.state) return route.routes[route.index].name;

  const childActiveRoute = route.routes[route.index].state;
  return getActiveRouteState(childActiveRoute);
};

export const getScreenAndParams = (data: any) => {
  const newData = typeof data === 'string' ? JSON.parse(data) : {};
  if (!isEmpty(newData)) {
    const {type, postId = 0, commentId = 0, child = {}} = newData;
    if (type !== undefined) {
      switch (type) {
        case NOTIFICATION_TYPE.POST.CREATED_IN_ONE_GROUP:
        case NOTIFICATION_TYPE.POST.CREATED_IN_MULTIPLE_GROUPS:
        case NOTIFICATION_TYPE.POST.IMPORTANT.CREATED_IN_ONE_GROUP:
        case NOTIFICATION_TYPE.POST.IMPORTANT.CREATED_IN_MULTIPLE_GROUPS:
        case NOTIFICATION_TYPE.POST.MENTION_IN_ONE_GROUP:
        case NOTIFICATION_TYPE.POST.MENTION_IN_MULTIPLE_GROUPS:
        case NOTIFICATION_TYPE.POST.VIDEO.PROCESSING:
        case NOTIFICATION_TYPE.POST.VIDEO.PUBLISHED:
        case NOTIFICATION_TYPE.REACT.POST_CREATOR:
        case NOTIFICATION_TYPE.REACT.POST_CREATOR_AGGREGATED:
          return {
            screen: 'home',
            params: {screen: 'post-detail', params: {post_id: postId}},
          };
        case NOTIFICATION_TYPE.POST.VIDEO.FAILED:
          return {
            screen: 'home',
            params: {screen: 'draft-post'},
          };
        case NOTIFICATION_TYPE.COMMENT.POST_CREATOR:
        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_POST:
        case NOTIFICATION_TYPE.COMMENT.USER_COMMENTED_ON_POST:
        case NOTIFICATION_TYPE.COMMENT.POST_CREATOR_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_POST_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT.USER_COMMENTED_ON_POST_AGGREGATED:
          return {
            screen: 'home',
            params: {
              screen: 'post-detail',
              params: {post_id: postId, focus_comment: true},
            },
          };

        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PREV_COMMENT:
        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_COMMENT:
        case NOTIFICATION_TYPE.REACT.COMMENT_CREATOR:
        case NOTIFICATION_TYPE.REACT.COMMENT_CREATOR_AGGREGATED:
          return {
            screen: 'home',
            params: {
              screen: 'comment-detail',
              params: {post_id: postId, commentId: commentId},
            },
          };

        case NOTIFICATION_TYPE.COMMENT.CREATOR_OF_THE_PARENT_COMMENT:
        case NOTIFICATION_TYPE.COMMENT.CREATOR_OF_THE_PARENT_COMMENT_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT.USER_REPLIED_TO_THE_SAME_PARENT_COMMENT:
        case NOTIFICATION_TYPE.COMMENT
          .USER_REPLIED_TO_THE_SAME_PARENT_COMMENT_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_REPLIED_COMMENT:
        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PREV_REPLIED_COMMENT:
        case NOTIFICATION_TYPE.COMMENT.USER_MENTIONED_IN_PARENT_COMMENT:
        case NOTIFICATION_TYPE.COMMENT
          .USER_MENTIONED_IN_PARENT_COMMENT_AGGREGATED:
          return {
            screen: 'home',
            params: {
              screen: 'comment-detail',
              params: {
                post_id: postId,
                commentId: child?.commentId,
                parentId: commentId,
              },
            },
          };
        default:
          console.log(`Notification type ${type} have not implemented yet`);
          return {
            screen: 'home',
            params: {screen: 'post-detail', params: {post_id: postId}},
          };
      }
    }
  }
  return {};
};
