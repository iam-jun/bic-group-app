import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';

import mainStack from './stack';
import screens from './screens';

import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {spacing} from '~/theme';
import {leftNavigationRef, rightNavigationRef} from '../refs';
import AppInfo from '~/screens/AppInfo';
import LeftTabs from './LeftTabs';
import {RootStackParamList} from '~/interfaces/IRouter';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';

const Stack = createStackNavigator();

const MainStack = (): React.ReactElement => {
  const dimensions = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, 'MainStack'>>();

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
          <BaseStackNavigator screens={screens} stack={mainStack} />
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
