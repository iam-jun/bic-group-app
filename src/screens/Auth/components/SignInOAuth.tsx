import React from 'react';
import {StyleSheet, Platform, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Button, useTheme} from 'react-native-paper';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth/lib/types/Auth';

import {useBaseHook} from '~/hooks';
import useAuth from '~/hooks/auth';
import {IObject} from '~/interfaces/common';
import actions from '~/screens/Auth/redux/actions';
import authProviders from '~/constants/authProviders';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

const SignInOAuth = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const {loading} = useAuth();

  const onPress = (provider: CognitoHostedUIIdentityProvider) => {
    dispatch(actions.signInOAuth(provider));
  };

  return (
    <View style={styles.container}>
      <Button
        testID="btnLoginFB"
        uppercase={false}
        style={[styles.button, styles.buttonFacebook]}
        onPress={() => onPress(authProviders.FACEBOOK)}
        disabled={loading}>
        <Text useI18n>{t('auth:btn_sign_in_fb')}</Text>
      </Button>
      <Button
        testID="btnLoginGG"
        uppercase={false}
        style={[styles.button, styles.buttonGoogle]}
        onPress={() => onPress(authProviders.GOOGLE)}
        disabled={loading}>
        <Text>{t('auth:btn_sign_in_gg')}</Text>
      </Button>
      {Platform.OS !== 'android' && (
        <Button
          testID="btnLoginApple"
          uppercase={false}
          style={[styles.button, styles.buttonApple]}
          onPress={() => onPress(authProviders.APPLE)}
          disabled={loading}>
          <Text>{t('auth:btn_sign_in_apple')}</Text>
        </Button>
      )}
    </View>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      padding: spacing.padding.large,
    },
    button: {
      height: 44,
      justifyContent: 'center',
      marginVertical: spacing.margin.tiny,
    },
    buttonFacebook: {
      backgroundColor: colors.facebook,
    },
    buttonGoogle: {
      backgroundColor: colors.google,
    },
    buttonApple: {
      backgroundColor: colors.apple,
    },
  });
};

export default SignInOAuth;
