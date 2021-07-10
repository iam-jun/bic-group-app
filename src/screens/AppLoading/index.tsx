import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/components/ScreenWrapper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import images from '~/resources/images';
import * as authActions from '~/screens/Auth/redux/actions';

const AppLoading = () => {
  const dispatch = useDispatch();

  const theme: IObject<any> = useTheme();
  const styles = themeStyles(theme);

  useEffect(() => {
    dispatch(authActions.checkAuthState());
  }, []);

  return (
    <ScreenWrapper
      testID="AppLoading"
      style={styles.container}
      isFullView
      colorSecondary>
      <Image resizeMode="contain" style={styles.logo} source={images.Logo} />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
    },

    logo: {
      width: '100%',
      height: 120,
      tintColor: colors.primary,
      marginTop: spacing.margin.big,
    },
  });
};

export default AppLoading;
