import React from 'react';
import {useWindowDimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';

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

  const MAX_WIDTH = width * 0.869;

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerPosition="right"
      drawerContent={props => <CustomDrawerContent {...props} />}
      edgeWidth={0}
      drawerStyle={{width: MAX_WIDTH}}>
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
