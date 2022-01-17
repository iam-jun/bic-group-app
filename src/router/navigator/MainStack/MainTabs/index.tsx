import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {io} from 'socket.io-client';

import {useUserIdAuth} from '~/hooks/auth';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import BottomTabBar from '~/router/components/BottomTabBar';
import mainTabStack from '~/router/navigator/MainStack/MainTabs/stack';
import notificationsActions from '~/screens/Notification/redux/actions';
import postActions from '~/screens/Post/redux/actions';
import {initPushTokenMessage} from '~/services/helper';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens, screensWebLaptop} from './screens';
import {useKeySelector} from '~/hooks/selector';
import {getEnv} from '~/utils/env';
import {parseSafe} from '~/utils/common';
import {getMsgPackParser} from '~/utils/socket';
import {ISocketReaction} from '~/interfaces/IPost';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme() as ITheme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  // const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const Tab = isPhone ? BottomTab : SideTab;

  const styles = createStyles(theme, isPhone, isLaptop);

  const dispatch = useDispatch();

  const token = useKeySelector('auth.user.signInUserSession.idToken.jwtToken');

  const userId = useUserIdAuth();
  useEffect(() => {
    // only valid if user logged in
    if (!userId) {
      return;
    }
    dispatch(postActions.getDraftPosts({}));
    if (Platform.OS !== 'web') {
      dispatch(notificationsActions.registerPushToken());
      let tokenRefreshSubscription;
      initPushTokenMessage()
        .then(messaging => {
          tokenRefreshSubscription = messaging().onTokenRefresh(
            (token: string) =>
              dispatch(notificationsActions.registerPushToken({token})),
          );
        })
        .catch(e =>
          console.log('error when delete push token at auth stack', e),
        );
      // @ts-ignore
      return tokenRefreshSubscription && tokenRefreshSubscription();
    }
  }, [userId]);

  useEffect(() => {
    dispatch(notificationsActions.getNotifications());

    const socket = io(getEnv('BEIN_FEED'), {
      transports: ['websocket'],
      path: '/ws',
      auth: {token},
      ...getMsgPackParser(getEnv('BEIN_FEED_WS_MSGPACK') !== 'disable'),
    });

    socket.on('connect', () => {
      console.log(
        `\x1b[36m🐣️ Bein feed socket connected with id: ${socket.id}\x1b[0m`,
      );
    });
    socket.on('disconnect', () => {
      console.log(`\x1b[36m🐣️ Bein feed socket disconnected\x1b[0m`);
    });
    socket.on('notification', handleSocketNoti);
    socket.on('reaction', handleSocketReaction);
    socket.on('un_reaction', handleSocketUnReaction);
    return () => {
      socket?.disconnect?.();
    };
  }, [token]);

  // callback when someone react to a post or comment, update its ownReact and reactionCounts on UI
  const handleSocketReaction = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket react\x1b[0m`);
    const data: ISocketReaction = parseSafe(msg);
    const payload = {userId, data};
    dispatch(postActions.updateReactionBySocket(payload));
  };

  // callback when someone un-react to a post or comment, update its ownReact and reactionCounts on UI
  const handleSocketUnReaction = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket un-react\x1b[0m`);
    const data: ISocketReaction = parseSafe(msg);
    const payload = {userId, data};
    dispatch(postActions.updateUnReactionBySocket(payload));
  };

  // callback function when client receive realtime activity in notification feed
  // load notifications again to get new unseen number (maybe increase maybe not if new activity is grouped)
  // with this, we also not to load notification again when access Notification screen
  const handleSocketNoti = (msg: string) => {
    console.log(`\x1b[32m🐣️ Maintab: received socket noti\x1b[0m`);
    const msgData = parseSafe(msg);
    const {data} = msgData || {};

    // for now realtime noti include "deleted" and "new"
    // for delete actitivity event "new" is empty
    // and we haven't handle "delete" event yet
    if (data?.new?.length > 0) {
      const actorId = data.new[0]?.actor?.id;
      const notiGroupId = data.new[0]?.id;
      const limit = data.new.length;
      if (actorId != userId) {
        const payload = {notiGroupId, limit: limit};
        dispatch(notificationsActions.loadNewNotifications(payload));
      }
    }
    if (data?.deleted?.length > 0) {
      dispatch(
        notificationsActions.deleteNotifications({
          notiGroupIds: data.deleted,
        }),
      );
    }
  };

  const isWebLaptop = Platform.OS === 'web' && isLaptop;
  if (isWebLaptop) {
    return (
      <BaseStackNavigator stack={mainTabStack} screens={screensWebLaptop} />
    );
  }

  return (
    // @ts-ignore
    <Tab.Navigator
      backBehavior={backBehavior}
      tabBar={props => <BottomTabBar {...props} />}
      tabBarStyle={styles.tabBar}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            listeners={{
              tabPress: () => DeviceEventEmitter.emit('onTabPress', name),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const createStyles = (theme: ITheme, isPhone: boolean, isLaptop: boolean) => {
  const {colors} = theme;
  return StyleSheet.create({
    tabBar: isPhone
      ? {}
      : {
          width: isLaptop ? 0 : 80,
          backgroundColor: colors.background,
        },
  });
};

export default MainTabs;
