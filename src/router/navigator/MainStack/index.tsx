import {
  NavigationContainer,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {RootStackParamList} from '~/interfaces/IRouter';
import RightCol from '~/screens/RightCol';
import PostAudiencesBottomSheet from '~/screens/Post/components/PostAudiencesBottomSheet';
import {closeConnectChat, connectChat} from '~/services/chatSocket';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {leftNavigationRef, rightNavigationRef} from '../refs';
import LeftTabs from './LeftTabs';
import MainTabs from './MainTabs';
import ReactionBottomSheet from '~/beinFragments/reaction/ReactionBottomSheet';

const Stack = createStackNavigator();

const MainStack = (): React.ReactElement => {
  const dimensions = useWindowDimensions();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, 'MainStack'>>();

  React.useEffect(() => {
    connectChat();
    return () => {
      closeConnectChat();
    };
  }, []);

  const renderLeftCol = () => (
    <View style={styles.leftCol}>
      <NavigationContainer independent ref={leftNavigationRef}>
        <LeftTabs initialRouteName={route?.params?.initialRouteName} />
      </NavigationContainer>
    </View>
  );

  const renderRightCol = () => (
    <View style={styles.rightCol}>
      <NavigationContainer independent ref={rightNavigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="right-column"
            component={RightCol}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {dimensions.width >= deviceDimensions.laptop && renderLeftCol()}
        <View style={styles.centerCol}>
          <MainTabs />
        </View>
        {dimensions.width >= deviceDimensions.desktop && renderRightCol()}
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
      flex: deviceDimensions.leftCols,
      ...Platform.select({
        web: {
          width: '30%',
          borderLeftColor: theme.colors.borderDivider,
          borderLeftWidth: 1,
        },
      }),
    },
    centerCol: {
      flex: deviceDimensions.centerCols,
    },
    rightCol: {
      width: 300,
    },
  });
};

export default MainStack;
