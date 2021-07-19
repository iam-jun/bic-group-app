import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, StackActions} from '@react-navigation/native';

import HorizontalView from '~/components/layout/HorizontalView';

import {screens, mainStack} from './stack';
import BottomTabs from './MainTabs';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {spacing} from '~/theme';
import {
  leftNavigationRef,
  rightNavigationRef,
  centerNavigationRef,
} from '../refs';
import AppInfo from '~/screens/AppInfo';

const Stack = createStackNavigator();

const MainStack = () => {
  const dimensions = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(theme);

  React.useEffect(() => {
    if (dimensions.width > deviceDimensions.bigTablet)
      centerNavigationRef?.current?.dispatch(StackActions.replace('home'));
    else centerNavigationRef?.current?.dispatch(StackActions.replace('main'));
  }, [dimensions.width]);

  return (
    <View style={styles.container}>
      <HorizontalView style={styles.content}>
        {dimensions.width > deviceDimensions.bigTablet && (
          <View
            style={{
              flex: deviceDimensions.leftCols,
              paddingStart: spacing.margin.base,
            }}>
            <NavigationContainer independent ref={leftNavigationRef}>
              <BottomTabs />
            </NavigationContainer>
          </View>
        )}
        <View
          style={{
            flex: deviceDimensions.centerCols,
          }}>
          <NavigationContainer ref={centerNavigationRef} independent={true}>
            <Stack.Navigator
              initialRouteName={
                dimensions.width > deviceDimensions.bigTablet ? 'home' : 'main'
              }>
              {Object.entries(mainStack).map(([name, component]) => {
                return (
                  <Stack.Screen
                    key={'screen' + component}
                    name={component}
                    // @ts-ignore
                    component={screens[component]}
                    options={{
                      animationEnabled: true,
                      headerShown: false,
                      title: name,
                    }}
                  />
                );
              })}
            </Stack.Navigator>
          </NavigationContainer>
        </View>
        {dimensions.width > deviceDimensions.laptop && (
          <View
            style={{
              flex: deviceDimensions.rightCols,
              paddingEnd: spacing.margin.base,
            }}>
            <NavigationContainer independent ref={rightNavigationRef}>
              <Stack.Navigator>
                <Stack.Screen name="app-info" component={AppInfo} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        )}
      </HorizontalView>
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
      flexGrow: deviceDimensions.totalCols,
      maxWidth: deviceDimensions.desktop,
      alignSelf: 'center',
    },
  });
};

export default MainStack;
