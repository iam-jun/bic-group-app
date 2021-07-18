import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {refMainNavigator} from '~/utils/refMainNavigator';
import HorizontalView from '~/components/layout/HorizontalView';

import screens from './screens';
import BottomTabs from './MainTabs';
import {useTheme} from 'react-native-paper';
import {Text} from '~/components';

const Stack = createStackNavigator();

const MainStack = () => {
  const dimensions = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <HorizontalView style={styles.content}>
        {dimensions.width > 768 && (
          <View
            style={{
              flex: 4,
            }}>
            <NavigationContainer independent={true}>
              <BottomTabs position="side" />
            </NavigationContainer>
          </View>
        )}
        {dimensions.width > 768 ? (
          <View
            style={{
              flex: 5,
              paddingHorizontal: 12,
            }}>
            <NavigationContainer ref={refMainNavigator} independent={true}>
              <Stack.Navigator initialRouteName={'home'}>
                {Object.entries(screens).map(([name, component]) => {
                  return (
                    <Stack.Screen
                      key={'screen' + name}
                      name={name}
                      component={component}
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
        ) : (
          <View
            style={{
              flex: 5,
              paddingHorizontal: 12,
            }}>
            <BottomTabs position={dimensions.width > 600 ? 'side' : 'bottom'} />
          </View>
        )}
        {dimensions.width > 1024 && (
          <View
            style={{
              flex: 3,
            }}>
            <Text h1 bold>
              Empty space
            </Text>
          </View>
        )}
      </HorizontalView>
    </View>
  );
};

const createStyles = theme => {
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
      flexGrow: 12,
      maxWidth: 1280,
      alignSelf: 'center',
    },
  });
};

export default MainStack;
