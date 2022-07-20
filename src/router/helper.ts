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
    const {
      type,
      postId = 0,
      commentId = 0,
      child = {},
      community = {},
      group = {},
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
          return {
            screen: 'home',
            params: {screen: 'post-detail', params: {post_id: postId}},
          };
        case NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL:
          return {
            screen: 'home',
            params: {screen: 'draft-post'},
          };
        case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR:
        case NOTIFICATION_TYPE.COMMENT_TO_POST_CREATOR_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_POST_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST:
        case NOTIFICATION_TYPE.COMMENT_TO_COMMENTED_USER_ON_POST_AGGREGATED:
          return {
            screen: 'home',
            params: {
              screen: 'post-detail',
              params: {post_id: postId, focus_comment: true},
            },
          };

        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_COMMENT:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT:
        case NOTIFICATION_TYPE.COMMENT_TO_MENTIONED_USER_IN_PARENT_COMMENT_AGGREGATED:
        case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR:
        case NOTIFICATION_TYPE.COMMENT_TO_PARENT_COMMENT_CREATOR_AGGREGATED:
        case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR:
        case NOTIFICATION_TYPE.REACTION_TO_COMMENT_CREATOR_AGGREGATED:
          return {
            screen: 'home',
            params: {
              screen: 'comment-detail',
              params: {postId: postId, commentId: commentId},
            },
          };

        case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT:
        case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_PUSH:
        case NOTIFICATION_TYPE.COMMENT_TO_REPLIED_USER_IN_THE_SAME_PARENT_COMMENT_AGGREGATED:
          return {
            screen: 'home',
            params: {
              screen: 'comment-detail',
              params: {
                postId: postId,
                commentId: child?.commentId,
                parentId: commentId,
              },
            },
          };
        case NOTIFICATION_TYPE.GROUP_ASSIGNED_ROLE_TO_USER:
        case NOTIFICATION_TYPE.GROUP_DEMOTED_ROLE_TO_USER:
          if (!!community?.id) {
            return {
              screen: 'communities',
              params: {
                screen: 'community-members',
                params: {
                  communityId: community.id,
                },
              },
            };
          }
          if (!!group?.id) {
            return {
              screen: 'communities',
              params: {
                screen: 'group-members',
                params: {
                  groupId: group.id,
                },
              },
            };
          }

          break;
        case NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP:
        case NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER:
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED:
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED:
        case NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP:
          if (!!community?.id) {
            return {
              screen: 'communities',
              params: {
                screen: 'community-detail',
                params: {
                  communityId: community.id,
                },
              },
            };
          }
          if (!!group?.id) {
            return {
              screen: 'communities',
              params: {
                screen: 'group-detail',
                params: {
                  groupId: group.id,
                },
              },
            };
          }
          break;
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN:
        case NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED:
          return {
            screen: 'communities',
            params: {
              screen: !!community?.id
                ? 'community-pending-members'
                : 'group-pending-members',
              params: {
                communityId: !!community?.id ? community.id : group.id || '',
              },
            },
          };
          break;
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
