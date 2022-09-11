import { Linking } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { useUserIdAuth } from '~/hooks/auth';
import { linkingConfig, linkingConfigFull } from '~/router/config';
import mainStack from '~/router/navigator/MainStack/stack';

export const PREFIX_DEEPLINK_GROUP = 'bic://';

const UUID_V4_PATTERN = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

const getLinkingCustomConfig = (
  config: any, navigation: any,
) => ({
  ...config,
  subscribe(listener: any) {
    const onReceiveURL = ({ url }: {url: string}) => {
      if (url.includes(`${PREFIX_DEEPLINK_GROUP}/posts/`)) {
        const data = url?.replace(`${PREFIX_DEEPLINK_GROUP}/posts/`, '');
        const params = data.split('?');

        if (params?.length === 1) {
          navigation?.navigate?.(
            mainStack.postDetail, { post_id: data },
          );
        } else if (params?.length > 1 && navigation) {
          const newParams = params[1]
            .split('&')
            ?.map((item) => item.split('='))
            ?.reduce(
              (
                p, c,
              ) => {
                if (c.length > 1) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line prefer-destructuring
                  p[c[0]] = c[1];
                }
                return p;
              }, {},
            );

          navigation?.navigate?.(
            mainStack.commentDetail, {
              ...newParams,
              postId: params[0],
            },
          );
        } else {
          listener(url);
        }
      } else if (url.match(`groups/${UUID_V4_PATTERN}`)) {
        const matchResult = url.match(`groups/${UUID_V4_PATTERN}`);
        const groupId = matchResult?.[0]?.replace('groups/', '');

        navigation?.navigate?.(mainStack.groupDetail, { groupId });
      } else if (url.match(`${PREFIX_DEEPLINK_GROUP}/communities/${UUID_V4_PATTERN}`)) {
        const communityId = url?.replace(`${PREFIX_DEEPLINK_GROUP}/communities/`, '');

        navigation?.navigate?.(mainStack.communityDetail, { communityId });
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
  const userId = useUserIdAuth();

  return getLinkingCustomConfig(
    userId ? linkingConfigFull : linkingConfig,
    rootNavigation,
  );
};

export default useNavigationLinkingConfig;
