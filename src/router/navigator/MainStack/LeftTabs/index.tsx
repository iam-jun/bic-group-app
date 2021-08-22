import React, {useEffect, useContext} from 'react';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {View, StyleSheet, Platform} from 'react-native';

import Icon from '~/beinComponents/Icon';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import useTabBadge from '~/hooks/tabBadge';

import {AppContext} from '~/contexts/AppContext';
import notificationsActions from '../../../../screens/Notification/redux/actions';
import useNotifications from '~/hooks/notifications';
import {useUserIdAuth} from '~/hooks/auth';
import RedDot from '~/beinComponents/Badge/RedDot';

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
  const notificationData = useNotifications();

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

  // render badget function
  const renderBadget = name => {
    let number = 0;
    switch (name) {
      case 'notification':
        number = notificationData.unseenNumber;
        break;
      // implement other badget number here
      default:
        break;
    }

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
            tabBarBadge={tabBadge[name]}
            tabBarBadgeStyle={{
              backgroundColor: tabBadge[name] > 0 ? '#EC2626' : 'transparent',
            }}
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
                    {renderBadget(name)}
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
          width: '22%',
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
