import React from 'react';
import {useWindowDimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';

import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';

const Drawer = createDrawerNavigator();

export interface Props {
  stack: {[x: string]: string};
  screens: {[x: string]: React.ComponentType<any>};
  initialRouteName?: string;
}

const BaseDrawerNavigator = ({
  stack,
  screens,
  initialRouteName,
}: Props): React.ReactElement => {
  const {width} = useWindowDimensions();

  const theme = useTheme() as ITheme;
  const {colors} = theme;

  //   const MAX_WIDTH = width * 0.869;

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerPosition="right"
      drawerContent={props => <CustomDrawerContent {...props} />}
      edgeWidth={0}
      drawerStyle={{
        width: width,
        backgroundColor: colors.transparent,
      }}>
      {Object.entries(stack).map(([name, component]) => {
        return (
          <Drawer.Screen
            key={'screen' + component}
            name={component} // TODO: refactor
            component={screens[component]}
            options={{
              // animationEnabled: true,
              headerShown: false,
              title: name,
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default BaseDrawerNavigator;
