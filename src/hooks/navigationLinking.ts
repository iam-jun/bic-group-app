import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {Linking} from 'react-native';
import {useRootNavigation} from '~/hooks/navigation';
import {useUserIdAuth} from '~/hooks/auth';
import {linkingConfig, linkingConfigFull} from '~/configs/navigator';

const getLinkingCustomConfig = (config: any, navigation: any) => {
  return {
    ...config,
    subscribe(listener: any) {
      const onReceiveURL = ({url}: {url: string}) => {
        if (url.includes('bein:///posts/')) {
          const data = url?.replace('bein:///posts/', '');
          const params = data.split('?');

          if (params?.length === 1) {
            navigation?.navigate?.(homeStack.postDetail, {post_id: data});
          } else if (params?.length > 1 && navigation) {
            const newParams = params[1]
              .split('&')
              ?.map(item => item.split('='))
              ?.reduce((p, c) => {
                if (c.length > 1) {
                  //@ts-ignore
                  p[c[0]] = c[1];
                }
                return p;
              }, {});

            navigation?.navigate?.(homeStack.commentDetail, {
              ...newParams,
              postId: params[0],
            });
          } else {
            listener(url);
          }
        } else {
          listener(url);
        }
      };
      const linkingListener = Linking.addEventListener('url', onReceiveURL);

      return () => {
        linkingListener?.remove?.();
      };
    },
  };
};

const useNavigationLinkingConfig = () => {
  const {rootNavigation} = useRootNavigation();
  const userId = useUserIdAuth();

  return getLinkingCustomConfig(
    userId ? linkingConfigFull : linkingConfig,
    rootNavigation,
  );
};

export default useNavigationLinkingConfig;
