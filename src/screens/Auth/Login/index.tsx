import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';
import ThemeView from '~/theme/components/ThemeView';
import {IObject} from '~/interfaces/common';
import {useDispatch} from 'react-redux';
import {spacing} from '~/theme/configs';
import Input from '~/theme/components/Input';
import * as actions from '~/store/auth/actions';
import {ViewSpacing} from '~/theme/components';
import InputPassword from '~/theme/components/Input/InputPassword';
import Button from '~/theme/components/Button/primary';

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme: IObject<any> = useTheme();
  const {t} = useBaseHook();
  const styles = themeStyles(theme);

  const signIn = () => {
    dispatch(actions.signIn({username, password}));
  };

  return (
    <ThemeView style={styles.container} isFullView>
      <Input
        testID="inputUsername"
        label={t('auth:input_label_email')}
        placeholder={t('auth:input_label_email')}
        autoCapitalize="none"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <InputPassword
        testID="inputPassword"
        label={t('auth:input_label_password')}
        placeholder={t('auth:input_label_password')}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <ViewSpacing height={80} />
      <Button
        testID="btnLogin"
        title={t('auth:btn_sign_in')}
        onPress={signIn}
        max
        type="light"
        largeBorder
        mode="contained">
        {t('auth:text_sign_in')}
      </Button>
    </ThemeView>
  );
};

const themeStyles = (theme: IObject<any>) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    button: {
      marginTop: spacing.margin.big,
    },
  });
};

export default Login;
