import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';
import ReactionDetailBottomSheet from '~/beinFragments/reaction/ReactionDetailBottomSheet';
import {AppConfig} from '~/configs';
import {chatSocketId} from '~/constants/chat';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import chatActions from '~/screens/Chat/redux/actions';
import PostAudiencesBottomSheet from '~/screens/Post/components/PostAudiencesBottomSheet';
import RightCol from '~/screens/RightCol';
import {
  addOnMessageCallback,
  closeConnectChat,
  connectChat,
  sendMessage,
} from '~/services/chatSocket';
import {getChatAuthInfo} from '~/services/httpApiRequest';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {leftNavigationRef, rightNavigationRef} from '../refs';
import LeftTabs from './LeftTabs';
import screens from './screens';
import stack from './stack';
import CommonModal from '~/beinFragments/CommonModal';

const Stack = createStackNavigator();

const MainStack = (): React.ReactElement => {
  const dimensions = useWindowDimensions();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const showLeftCol = dimensions.width >= deviceDimensions.laptop;
  const showRightCol = dimensions.width >= deviceDimensions.desktop;
  const auth = getChatAuthInfo();
  const dispatch = useDispatch();

  React.useEffect(() => {
    connectChat();
    const removeOnMessageCallback = addOnMessageCallback(
      'callback-of-list-chat-screen',
      event => {
        dispatch(chatActions.handleEvent(JSON.parse(event.data)));
      },
    );

    subscribeRoomsMessages();

    return () => {
      closeConnectChat();
      removeOnMessageCallback();
      unsubscribeRoomsMessages();
    };
  }, []);

  const subscribeRoomsMessages = () => {
    sendMessage({
      msg: 'sub',
      id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
      name: 'stream-room-messages',
      params: ['__my_messages__', false],
    });
    sendMessage({
      msg: 'sub',
      id: chatSocketId.SUBSCRIBE_NOTIFY_USER,
      name: 'stream-notify-user',
      params: [`${auth?.userId}/subscriptions-changed`, false],
    });
  };

  const unsubscribeRoomsMessages = () => {
    sendMessage({
      msg: 'unsub',
      id: chatSocketId.SUBSCRIBE_ROOMS_MESSAGES,
    });
  };

  const renderLeftCol = () => (
    <View style={styles.leftCol}>
      <NavigationContainer
        independent
        ref={leftNavigationRef}
        documentTitle={{enabled: false}}>
        <LeftTabs />
      </NavigationContainer>
    </View>
  );

  const renderRightCol = () => (
    <View style={styles.rightCol}>
      <NavigationContainer
        independent
        ref={rightNavigationRef}
        documentTitle={{enabled: false}}>
        <Stack.Navigator>
          <Stack.Screen
            name="right-column"
            component={RightCol}
            options={AppConfig.defaultScreenOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showLeftCol && renderLeftCol()}
        <View style={styles.centerAndRightCol}>
          <View style={styles.centerCol}>
            <BaseStackNavigator stack={stack} screens={screens} />
          </View>
          {showRightCol && renderRightCol()}
        </View>
      </View>
      <PostAudiencesBottomSheet />
      <ReactionBottomSheet />
      <ReactionDetailBottomSheet />
      <CommonModal />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.background,
      alignItems: 'center',
    },
    content: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      flexGrow: deviceDimensions.totalCols,
      maxWidth: deviceDimensions.desktopBigger,
      alignSelf: 'center',
    },
    leftCol: {
      flex: deviceDimensions.leftCol,
      ...Platform.select({
        web: {
          width: '30%',
          minWidth: 400,
          borderLeftColor: theme.colors.borderDivider,
          borderLeftWidth: 1,
          borderRightColor: theme.colors.borderDivider,
          borderRightWidth: 1,
        },
      }),
    },
    centerAndRightCol: {
      flex: deviceDimensions.centerAndRightCol,
      flexDirection: 'row',
    },
    centerCol: {
      flex: 1,
    },
    rightCol: {
      width: 332,
    },
  });
};

export default MainStack;
