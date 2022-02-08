import React from 'react';
import {View, StyleSheet} from 'react-native';
import Newsfeed from '~/screens/Home';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import {useIsDrawerOpen} from '@react-navigation/drawer';

const DrawerMenu = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();

  const refTimer = React.useRef<any>();

  useFocusEffect(
    React.useCallback(() => {
      if (!isDrawerOpen) {
        openDrawer();
      }
    }, [isDrawerOpen]),
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(refTimer?.current);
    };
  }, []);

  const openDrawer = () => {
    refTimer.current = setTimeout(() => {
      navigation.dispatch(DrawerActions.openDrawer());
      // navigation.openDrawer();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Newsfeed />
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

export default DrawerMenu;
