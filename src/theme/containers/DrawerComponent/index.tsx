import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ThemeView from '~/theme/components/ThemeView';
import {IObject} from '~/interfaces/common';
import useAuth from '~/hooks/auth';
import HeaderView from '~/theme/components/Header/HeaderView';
import {spacing} from '~/theme/configs';
import TransparentButton from '~/theme/components/Button/transparent';
import {useBaseHook} from '~/hooks';
import * as authActions from '~/store/auth/actions';

const DrawerComponent = () => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {user} = useAuth();

  const theme: IObject<any> = useTheme();
  const styles = themeStyles(theme);

  return (
    <ThemeView testID="DrawerComponent" style={styles.container} isFullView>
      <HeaderView
        firstLabel={user?.name}
        secondLabel={user?.email}
        avatar={{user}}
        style={styles.header}
      />

      <TransparentButton
        title={t('auth:text_sign_out')}
        onPress={() => dispatch(authActions.signOut())}
      />
    </ThemeView>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.big,
      justifyContent: 'space-between',
    },
    header: {
      paddingHorizontal: spacing.padding.base,
    },
  });
};

export default DrawerComponent;
