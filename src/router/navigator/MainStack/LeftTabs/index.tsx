import React, {useContext, useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import RedDot from '~/beinComponents/Badge/RedDot';
import Icon from '~/beinComponents/Icon';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import useTabBadge from '~/hooks/tabBadge';
import {ITheme} from '~/theme/interfaces';
import notificationsActions from '../../../../screens/Notification/redux/actions';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {screens} from './screens';

const Tab = createSideTabNavigator();

interface Props {
  initialRouteName?: string;
}

const LeftTabs: React.FC<Props> = ({initialRouteName}): React.ReactElement => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = CreateStyle();

  // const {activeColor, inactiveColor, tabBarBackground} = colors;
  const tabBadge = useTabBadge();

  const dispatch = useDispatch();

  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  useEffect(() => {
    dispatch(
      notificationsActions.getNotifications({
        streamClient,
        userId: userId.toString(),
      }),
    );
  }, []);

  const renderBadge = (name: string) => {
    const number = tabBadge[name];

    if (number > 0) {
      return <RedDot style={{top: 15, left: 45}} number={number} />;
    } else {
      return null;
    }
  };

  return (
    // @ts-ignore
    <Tab.Navigator
      initialRouteName={initialRouteName}
      activeBackgroundColor={colors.bgButtonSecondary}
      backBehavior={'history'}
      tabBarStyle={styles.navigatorContainer}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({focused, color}) => {
                const icon = focused ? bottomTabIconsFocused : bottomTabIcons;
                return (
                  <View style={styles.iconContainer}>
                    <Icon
                      //@ts-ignore
                      icon={icon[name]}
                      size={24}
                      tintColor="none"
                      bold={focused}
                    />
                    {renderBadge(name)}
                  </View>
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const CreateStyle = () => {
  return StyleSheet.create({
    navigatorContainer: {
      ...Platform.select({
        web: {
          width: 80,
        },
        default: {
          width: 48,
        },
      }),
    },
    iconContainer: {
      flex: 1,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
  });
};

export default LeftTabs;
