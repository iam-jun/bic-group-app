import { Linking } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { linkingConfig, PREFIX_DEEPLINK_GROUP, PREFIX_HTTPS } from '~/router/config';
import mainStack from '~/router/navigator/MainStack/stack';
import getEnv from '~/utils/env';
import { DEEP_LINK_TYPES, matchDeepLink } from '~/utils/link';

const getLinkingCustomConfig = (
  config: any, navigation: any,
) => ({
  ...config,
  subscribe(listener: any) {
    const onReceiveURL = ({ url }: { url: string }) => {
      const match = matchDeepLink(url);

      if (match) {
        switch (match.type) {
          case DEEP_LINK_TYPES.POST_DETAIL:
            navigation?.navigate?.(mainStack.postDetail, { post_id: match.postId });
            break;

          case DEEP_LINK_TYPES.COMMENT_DETAIL:
            navigation?.navigate?.(mainStack.commentDetail, {
              ...match.params,
              postId: match.postId,
            });
            break;

          case DEEP_LINK_TYPES.COMMUNTY_DETAIL:
            navigation?.navigate?.(mainStack.communityDetail, { communityId: match.communityId });
            break;

          case DEEP_LINK_TYPES.GROUP_DETAIL:
            navigation?.navigate?.(mainStack.groupDetail, {
              communityId: match.communityId,
              groupId: match.groupId,
            });
            break;

          default:
            listener(url);
        }
      } else {
        /**
         * convert back to normal web link to open on browser
         * for unsupported deep link
         */
        const webLink = url.replace(PREFIX_DEEPLINK_GROUP, PREFIX_HTTPS + getEnv('SELF_DOMAIN'));
        Linking.openURL(webLink);
      }
    };
    const linkingListener = Linking.addEventListener(
      'url', onReceiveURL,
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
