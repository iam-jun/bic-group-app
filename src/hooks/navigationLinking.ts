import { Linking } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { linkingConfig } from '~/router/config';
import mainStack from '~/router/navigator/MainStack/stack';
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
            navigation?.navigate?.(mainStack.postDetail, { post_id: match.id });
            break;

          case DEEP_LINK_TYPES.COMMENT_DETAIL:
            navigation?.navigate?.(mainStack.commentDetail, {
              ...match.params,
              postId: match.id,
            });
            break;

          case DEEP_LINK_TYPES.COMMUNTY_DETAIL:
            navigation?.navigate?.(mainStack.communityDetail, { communityId: match.id });
            break;

          case DEEP_LINK_TYPES.GROUP_DETAIL:
            navigation?.navigate?.(mainStack.groupDetail, { groupId: match.id });
            break;

          default:
            listener(url);
        }
      } else {
        listener(url);
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
