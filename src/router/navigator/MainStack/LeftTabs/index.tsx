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
import {useUserIdAuth} from '~/hooks/auth';
import RedDot from '~/beinComponents/Badge/RedDot';

const Tab = createSideTabNavigator();

interface Props {
  initialRouteName?: string;
}

const LeftTabs: React.FC<Props> = ({initialRouteName}): React.ReactElement => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = CreateStyle(theme);

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
              tabBarIcon: ({focused}: {focused: boolean}) => {
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

const CreateStyle = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    navigatorContainer: {
      ...Platform.select({
        web: {
          width: 80,
          borderRightColor: colors.borderDivider,
          borderRightWidth: 1,
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
