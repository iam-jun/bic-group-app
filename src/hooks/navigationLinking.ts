/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Linking } from 'react-native';
import groupApi from '~/api/GroupApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { useRootNavigation } from '~/hooks/navigation';
import { linkingConfig, PREFIX_DEEPLINK_GROUP, PREFIX_URL } from '~/router/config';
import { hideSplashScreen, Props as IRootNavigation } from '~/router/helper';
import authStacks from '~/router/navigator/AuthStack/stack';
import mainStack from '~/router/navigator/MainStack/stack';
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
      case DeepLinkTypes.POST_DETAIL:
        navigation?.navigate?.(mainStack.postDetail, { post_id: match.postId });
        break;

      case DeepLinkTypes.COMMENT_DETAIL:
        navigation?.navigate?.(mainStack.commentDetail, {
          ...match.params as Object,
          postId: match.postId,
        });
        break;

      case DeepLinkTypes.COMMUNTY_DETAIL:
        navigation?.navigate?.(mainStack.communityDetail, { communityId: match.communityId });
        break;

      case DeepLinkTypes.GROUP_DETAIL:
        navigation?.navigate?.(mainStack.groupDetail, {
          communityId: match.communityId,
          groupId: match.groupId,
        });
        break;
      case DeepLinkTypes.SERIES_DETAIL:
        navigation?.navigate?.(mainStack.seriesDetail, {
          seriesId: match.seriesId,
        });
        break;
      case DeepLinkTypes.ARTICLE_DETAIL:
        navigation?.navigate?.(mainStack.articleContentDetail, {
          articleId: match.articleId,
        });
        break;
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
      case DeepLinkTypes.USER_PROFILE:
        navigateFromUserProfile({
          match, navigation, userId, url,
        });
        break;
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
        navigation?.navigate?.(mainStack.communityDetail, { communityId });
      }
    } catch (error) {
      console.error('joinCommunity error:', error);
      await hideSplashScreen();
      if (
        error?.code === APIErrorCode.Group.ALREADY_MEMBER
        || error?.code === APIErrorCode.Group.JOIN_REQUEST_ALREADY_SENT
      ) {
        navigation?.navigate?.(mainStack.communityDetail, { communityId });
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

const navigateFromUserProfile = (params: { userId: any; navigation: IRootNavigation; match: any; url: string }) => {
  const {
    userId, navigation, match, url,
  } = params;
  if (userId) {
    navigation?.navigate?.(mainStack.userProfile, {
      userId: match.userName,
      params: {
        type: 'username',
      },
    });
    return;
  }
  navigation?.navigate?.(authStacks.signIn);
  useAppStore.getState().actions.setRedirectUrl(url);
};

export default useNavigationLinkingConfig;
