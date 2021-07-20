import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';

import {screens, mainStack} from './stack';

import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {spacing} from '~/theme';
import {
  leftNavigationRef,
  rightNavigationRef,
  centerNavigationRef,
  rootNavigationRef,
} from '../refs';
import AppInfo from '~/screens/AppInfo';
import LeftTabs from './LeftTabs';

const Stack = createStackNavigator();

const MainStack = () => {
  const dimensions = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(theme);

  React.useEffect(() => {
    console.log({
      rootNavigationRef,
      root: rootNavigationRef?.current?.getRootState(),
      parent: rootNavigationRef?.current?.dangerouslyGetParent(),
      state: rootNavigationRef?.current?.dangerouslyGetState(),
      route: rootNavigationRef?.current?.getCurrentRoute(),
    });
  }, [rootNavigationRef]);

  const config = {
    screens: {
      main: {
        path: '',
        screens: {
          home: {
            path: 'home',
            screens: {
              newsfeed: {
                path: '',
              },
            },
          },
          chat: {
            path: 'chat',
            screens: {
              Chat: {
                path: '',
              },
            },
          },
        },
      },
    },
  };

  const linking = {
    prefixes: ['https://bein.group', 'bein://'],
    config,
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {dimensions.width > deviceDimensions.bigTablet && (
          <View
            style={{
              flex: deviceDimensions.leftCols,
              paddingEnd: spacing.margin.base,
            }}>
            <NavigationContainer independent ref={leftNavigationRef}>
              <LeftTabs />
            </NavigationContainer>
          </View>
        )}
        <View
          style={{
            flex: deviceDimensions.centerCols,
          }}>
          <NavigationContainer
            linking={linking}
            ref={centerNavigationRef}
            independent={true}>
            <Stack.Navigator
              initialRouteName={
                dimensions.width > deviceDimensions.bigTablet ? 'main' : 'main'
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
