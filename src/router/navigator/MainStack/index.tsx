import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  NavigationContainer,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import AlertModal from '~/beinComponents/modals/AlertModal';
import {useRootNavigation} from '~/hooks/navigation';
import {RootStackParamList} from '~/interfaces/IRouter';
import {rootSwitch} from '~/router/stack';
import AppInfo from '~/screens/AppInfo';
import notificationsActions from '~/constants/notificationActions';
import {closeConnectChat, connectChat} from '~/services/chatSocket';
import {spacing} from '~/theme';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {leftNavigationRef, rightNavigationRef} from '../refs';
import LeftTabs from './LeftTabs';
import MainTabs from './MainTabs';

const Stack = createStackNavigator();

const MainStack = (): React.ReactElement => {
  const dimensions = useWindowDimensions();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, 'MainStack'>>();
  const {rootNavigation} = useRootNavigation();

  React.useEffect(() => {
    listenFCMEvents();
    connectChat();
    return () => {
      closeConnectChat();
    };
  }, []);

  const listenFCMEvents = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      handleOpenedNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        handleInitialNotification(remoteMessage);
      });
  };

  const handleOpenedNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    const data = handleMessageData(remoteMessage);
    if (data) rootNavigation.navigate(data.screen, data.params);
  };

  const handleInitialNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    const data = handleMessageData(remoteMessage);

    if (data) rootNavigation.navigate(rootSwitch.mainStack, data);
  };

  const handleMessageData = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ): {screen: any; params: any} | undefined => {
    if (!remoteMessage) return;

    try {
      //@ts-ignore
      let screen = notificationsActions[remoteMessage?.data?.type];
      const payload = remoteMessage?.data?.payload
        ? JSON.parse(remoteMessage?.data?.payload)
        : undefined;
      if (screen.params)
        screen = {
          ...screen,
          params: {...screen.params, params: {...payload, initial: false}},
        };
      else screen = {...screen, params: {...payload, initial: false}};
      return screen;
    } catch (err) {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {dimensions.width >= deviceDimensions.bigTablet && (
          <View
            style={{
              flex: deviceDimensions.leftCols,
              paddingEnd: spacing.margin.base,
            }}>
            <NavigationContainer independent ref={leftNavigationRef}>
              <LeftTabs initialRouteName={route?.params?.initialRouteName} />
            </NavigationContainer>
          </View>
        )}
        <View
          style={{
            flex: deviceDimensions.centerCols,
          }}>
          <MainTabs />
        </View>
        {dimensions.width >= deviceDimensions.laptop && (
          <View
            style={{
              flex: deviceDimensions.rightCols,
              paddingStart: spacing.margin.base,
            }}>
            <NavigationContainer independent ref={rightNavigationRef}>
              <Stack.Navigator>
                <Stack.Screen name="app-info" component={AppInfo} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        )}
      </View>
      <AlertModal />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    content: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      flexGrow: deviceDimensions.totalCols,
      maxWidth: deviceDimensions.desktop,
      alignSelf: 'center',
    },
  });
};

export default MainStack;
