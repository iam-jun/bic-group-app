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
    messaging().onNotificationOpenedApp(remoteMessage => {
      handleOpenedNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          remoteMessage.data?.type &&
            rootNavigation.replace(rootSwitch.mainStack, {
              screen: remoteMessage.data?.type,
            });
        }
      });
    console.log({route});
    connectChat();
    return () => {
      closeConnectChat();
    };
  }, []);

  const handleOpenedNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );

    remoteMessage.data?.type &&
      rootNavigation.navigate(remoteMessage.data?.type);

    // setInitialRouteName(remoteMessage.data?.type);
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
