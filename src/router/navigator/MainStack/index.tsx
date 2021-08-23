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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {dimensions.width >= deviceDimensions.bigTablet && (
          <View style={styles.leftCol}>
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
        )}
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
      maxWidth: deviceDimensions.desktop,
      alignSelf: 'center',
    },
    leftCol: {
      flex: deviceDimensions.leftCols,
      paddingEnd: theme.spacing.padding.extraLarge,
      ...Platform.select({
        web: {
          borderLeftColor: theme.colors.borderDivider,
          borderLeftWidth: 1,
        },
      }),
    },
    rightCol: {
      flex: deviceDimensions.rightCols,
      paddingStart: theme.spacing.padding.extraLarge,
    },
  });
};

export default MainStack;
