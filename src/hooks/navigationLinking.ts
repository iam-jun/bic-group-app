/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Linking } from 'react-native';
import groupApi from '~/api/GroupApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { useRootNavigation } from '~/hooks/navigation';
import { linkingConfig, PREFIX_DEEPLINK_GROUP, PREFIX_URL } from '~/router/config';
import {
  hideSplashScreen, Props as IRootNavigation, navigateToCommunityDetail, navigateToGroupDetail,
} from '~/router/helper';
import authStacks from '~/router/navigator/AuthStack/stack';
import mainStack from '~/router/navigator/MainStack/stack';
import useForgotPasswordStore from '~/screens/auth/ForgotPassword/store';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import useAuthController from '~/screens/auth/store';
import useAppStore from '~/store/app';
import showToastError from '~/store/helper/showToastError';
import getEnv from '~/utils/env';
import { DeepLinkTypes, matchDeepLink, openInAppBrowser } from '~/utils/link';

export const onReceiveURL = async ({
  url,
  navigation,
  listener,
}: {
  url: string;
  navigation: IRootNavigation;
  listener?: any;
}) => {
  const match = matchDeepLink(url);

  const userId = useAuthController?.getState?.().authUser?.userId;

  if (match) {
    if (match.type !== DeepLinkTypes.REFERRAL) {
      await hideSplashScreen();
    }

    switch (match.type) {
      case DeepLinkTypes.POST_DETAIL: {
        const navigateToPostDetail = () => navigation?.navigate?.(
          mainStack.postDetail, { post_id: match.postId },
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToPostDetail,
        });
        break;
      }

      case DeepLinkTypes.COMMENT_DETAIL: {
        const navigateToCommentDetail = () => navigation?.navigate?.(
          mainStack.commentDetail, {
            ...match.params as Object,
            postId: match.postId,
          },
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToCommentDetail,
        });
        break;
      }

      case DeepLinkTypes.COMMUNTY_DETAIL: {
        const _navigateToCommunityDetail = () => navigateToCommunityDetail({ communityId: match.communityId });
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: _navigateToCommunityDetail,
        });
        break;
      }

      case DeepLinkTypes.DISCOVER_COMMUNITIES: {
        const navigateToDiscoverCommunities = () => navigation?.navigate?.(
          mainStack.discover,
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToDiscoverCommunities,
        });
        break;
      }

      case DeepLinkTypes.GROUP_DETAIL: {
        // eslint-disable-next-line max-len
        const _navigateToGroupDetail = () => navigateToGroupDetail({ communityId: match.communityId, groupId: match.groupId });
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: _navigateToGroupDetail,
        });
        break;
      }

      case DeepLinkTypes.SERIES_DETAIL: {
        const navigateToSeriesDetail = () => navigation?.navigate?.(
          mainStack.seriesDetail, {
            seriesId: match.seriesId,
          },
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToSeriesDetail,
        });
        break;
      }

      case DeepLinkTypes.ARTICLE_DETAIL: {
        const navigateToArticleDetail = () => navigation?.navigate?.(
          mainStack.articleContentDetail, {
            articleId: match.articleId,
          },
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToArticleDetail,
        });
        break;
      }

      case DeepLinkTypes.LOGIN:
        if (userId) return;
        navigation?.navigate?.(authStacks.signIn);
        break;
      case DeepLinkTypes.FORGOT_PASSWORD:
        if (userId) return;
        navigation?.navigate?.(authStacks.forgotPassword);
        break;
      case DeepLinkTypes.CONFIRM_USER:
        navigation?.navigate?.(userId ? mainStack.confirmUser : authStacks.confirmUser, { params: match.params });
        break;
      case DeepLinkTypes.REFERRAL:
        await navigateFromReferralLink({ match, navigation, userId });
        break;

      case DeepLinkTypes.USER_PROFILE: {
        const navigateToUserProfile = () => navigation?.navigate?.(
          mainStack.userProfile, {
            userId: match.userName,
            params: {
              type: 'username',
            },
          },
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToUserProfile,
        });
        break;
      }
      case DeepLinkTypes.RESET_PASSOWRD:
        if (userId) return;
        useForgotPasswordStore.getState?.().reset?.();
        navigation?.navigate?.(authStacks.forgotPassword, { data: match.params });
        break;

      case DeepLinkTypes.NOTIFICATION_SETTINGS: {
        navigation?.navigate?.(notiStack.notiSettings);
        break;
      }

      case DeepLinkTypes.USER_BLOCKING: {
        const navigateToUserBlockingList = () => navigation?.navigate?.(
          mainStack.blocking,
        );
        redirectToScreenWithSignIn({
          userId, url, navigateCallback: navigateToUserBlockingList,
        });
        break;
      }
      case DeepLinkTypes.NOTIFICATION_ADVANCED_SETTINGS: {
        navigation?.navigate?.(notiStack.advancedSettings);
        break;
      }

      case DeepLinkTypes.PRIVACY: {
        navigation?.navigate?.(mainStack.privacyCenter);
        break;
      }

      case DeepLinkTypes.COMMUNYTIES_TAB: {
        navigation?.navigate?.(groupStack.communities);
        break;
      }

      case DeepLinkTypes.APP:
        break;
      default:
        listener?.(url);
    }
  } else {
    await hideSplashScreen();
    /**
     * convert back to normal web link to open on browser
     * for unsupported deep link
     */
    const webLink = url.replace(PREFIX_DEEPLINK_GROUP, PREFIX_URL + getEnv('SELF_DOMAIN'));
    openInAppBrowser(webLink);
  }
};

const getLinkingCustomConfig = (
  config: any, navigation: IRootNavigation,
) => ({
  ...config,
  subscribe(listener: any) {
    const linkingListener = Linking.addEventListener(
      'url', ({ url }: {url: string}) => onReceiveURL({ url, navigation, listener }),
    );

    return () => {
      linkingListener?.remove?.();
    };
  },
});

const useNavigationLinkingConfig = () => {
  const { rootNavigation } = useRootNavigation();

  return getLinkingCustomConfig(linkingConfig, rootNavigation);
};

const navigateFromReferralLink = async (payload: { match: any; navigation: IRootNavigation; userId: any }) => {
  const { match, navigation, userId } = payload || {};
  const { referralCode } = match || {};
  let responseValidate = null;

  try {
    responseValidate = await groupApi.validateReferralCode({ code: referralCode });
  } catch (error) {
    console.error('validateReferralCode error:', error);
  }

  if (responseValidate && responseValidate?.data) {
    await navigateWithValidReferralCode({
      userId,
      responseValidate,
      navigation,
      referralCode,
    });
  } else {
    await navigateWithInvalidReferralCode({ userId, navigation });
  }
};

const navigateWithValidReferralCode = async (payload: {
  userId: any;
  responseValidate: any;
  navigation: IRootNavigation;
  referralCode: string;
}) => {
  const {
    userId, responseValidate, navigation, referralCode,
  } = payload;
  if (userId) {
    const { groupId: rootGroupId, id: communityId } = responseValidate?.data || {};
    try {
      const responseJoinCommunity = await groupApi.joinCommunity(rootGroupId);
      if (responseJoinCommunity && responseJoinCommunity?.data) {
        navigateToCommunityDetail({ communityId });
      }
    } catch (error) {
      console.error('joinCommunity error:', error);
      await hideSplashScreen();
      if (
        error?.code === APIErrorCode.Group.ALREADY_MEMBER
        || error?.code === APIErrorCode.Group.JOIN_REQUEST_ALREADY_SENT
      ) {
        navigateToCommunityDetail({ communityId });
      } else {
        navigation?.navigate?.('home');
        showToastError(error);
      }
    }
  } else {
    // @ts-ignore
    navigation?.replaceListScreenByNewScreen?.(getListScreenToReplace(), {
      name: authStacks.signUp,
      params: { isValidLink: true, referralCode },
    });
  }
};

const navigateWithInvalidReferralCode = async (payload: { userId: any; navigation: IRootNavigation }) => {
  const { userId, navigation } = payload;
  if (userId) {
    await hideSplashScreen();
    navigation?.navigate?.('home');
  } else {
    // @ts-ignore
    navigation?.replaceListScreenByNewScreen?.(getListScreenToReplace(), {
      name: authStacks.signUp,
      params: { isValidLink: false },
    });
  }
};

const getListScreenToReplace = () => {
  const listScreen = Object.values(authStacks).filter((screen) => screen !== authStacks.signUp);
  return listScreen;
};

const redirectToScreenWithSignIn = (params: {
  userId: any;
  url: string;
  navigateCallback: () => void }) => {
  const {
    userId, url, navigateCallback,
  } = params;

  if (userId) {
    navigateCallback?.();
    return;
  }

  useAppStore.getState().actions.setRedirectUrl(url);
};

export default useNavigationLinkingConfig;
