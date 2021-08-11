import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import images from '~/resources/images';
import * as authActions from '~/screens/Auth/redux/actions';
import {spacing} from '~/theme';

const AppLoading = () => {
  const dispatch = useDispatch();

  const styles = themeStyles();

  useEffect(() => {
    dispatch(authActions.checkAuthState());
  }, []);

  return (
    <ScreenWrapper testID="AppLoading" style={styles.container} isFullView>
      <Image resizeMode="contain" style={styles.logo} source={images.logo} />
    </ScreenWrapper>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: '#3F2885',
    },

    logo: {
      width: '100%',
      height: 120,
      tintColor: '#fff',
      marginTop: spacing.margin.big,
    },
  });
};

export default AppLoading;
