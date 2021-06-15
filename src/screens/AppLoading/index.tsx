import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ThemeView from '~/theme/components/ThemeView';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme/configs';
import images from '~/constants/images';
import * as authActions from '~/store/auth/actions';

const AppLoading = () => {
  const dispatch = useDispatch();

  const theme: IObject<any> = useTheme();
  const styles = themeStyles(theme);

  useEffect(() => {
    dispatch(authActions.checkAuthState());
  }, []);

  return (
    <ThemeView
      testID="AppLoading"
      style={styles.container}
      isFullView
      colorSecondary>
      <Image resizeMode="contain" style={styles.logo} source={images.Logo} />
    </ThemeView>
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
