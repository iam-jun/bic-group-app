import {
  NavigationContainer,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';
import {AppConfig} from '~/configs';

import {RootStackParamList} from '~/interfaces/IRouter';
import PostAudiencesBottomSheet from '~/screens/Post/components/PostAudiencesBottomSheet';
import RightCol from '~/screens/RightCol';
import {closeConnectChat, connectChat} from '~/services/chatSocket';
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
  const showLeftCol = dimensions.width >= deviceDimensions.laptop;
  const showRightCol = dimensions.width >= deviceDimensions.desktop;

  React.useEffect(() => {
    connectChat();
    return () => {
      closeConnectChat();
    };
  }, []);

  const renderLeftCol = () => (
    <View style={styles.leftCol}>
      <NavigationContainer
        independent
        ref={leftNavigationRef}
        documentTitle={{enabled: false}}>
        <LeftTabs initialRouteName={route?.params?.initialRouteName} />
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
            <MainTabs />
          </View>
          {showRightCol && renderRightCol()}
        </View>
      </View>
      <PostAudiencesBottomSheet />
      <ReactionBottomSheet />
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
