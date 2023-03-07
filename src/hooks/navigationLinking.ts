import { Linking } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import {
  linkingConfig, PREFIX_DEEPLINK_GROUP, PREFIX_URL,
} from '~/router/config';
import authStacks from '~/router/navigator/AuthStack/stack';
import mainStack from '~/router/navigator/MainStack/stack';
import useCommonController from '~/screens/store';
import getEnv from '~/utils/env';
import { DeepLinkTypes, matchDeepLink, openInAppBrowser } from '~/utils/link';

const isHasCurrentUser = () => {
  const userProfileData = useCommonController.getState().myProfile;
  return !!userProfileData?.id;
};

export const onReceiveURL = ({ url, navigation, listener }: { url: string, navigation:any, listener?: any }) => {
  const match = matchDeepLink(url);

  if (match) {
    switch (match.type) {
      case DeepLinkTypes.POST_DETAIL:
        navigation?.navigate?.(mainStack.postDetail, { post_id: match.postId });
        break;

      case DeepLinkTypes.COMMENT_DETAIL:
        navigation?.navigate?.(mainStack.commentDetail, {
          ...match.params,
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
        if (isHasCurrentUser()) return;
        navigation?.navigate?.(authStacks.signIn);
        break;
      case DeepLinkTypes.FORGOT_PASSWORD:
        if (isHasCurrentUser()) return;
        navigation?.navigate?.(authStacks.forgotPassword);
        break;
      case DeepLinkTypes.CONFIRM_USER:
        navigation?.navigate?.(isHasCurrentUser()
          ? mainStack.confirmUser
          : authStacks.confirmUser, { params: match.params });
        break;
      default:
        listener?.(url);
    }
  } else {
    /**
     * convert back to normal web link to open on browser
     * for unsupported deep link
     */
    const webLink = url.replace(PREFIX_DEEPLINK_GROUP, PREFIX_URL + getEnv('SELF_DOMAIN'));
    openInAppBrowser(webLink);
  }
};

const getLinkingCustomConfig = (
  config: any, navigation: any,
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

export default useNavigationLinkingConfig;
