import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/components/ScreenWrapper';
import {IObject} from '~/interfaces/common';
import useAuth from '~/hooks/auth';
import HeaderView from '~/components/HeaderView';
import {spacing} from '~/theme';
import TransparentButton from '~/components/buttons/TransparentButton';
import {useBaseHook} from '~/hooks';
import * as authActions from '~/store/auth/actions';
import ListView from '~/components/list/ListView';
import settings from '~/constants/settings';
import {Container, ViewSpacing} from '~/components';
import {Portal} from 'react-native-portalize';
import LanguageOptionsModal from '~/components/fragments/optionModals/AppLanguageOptions';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '~/contexts/AppContext';

const Menu = () => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {user} = useAuth();
  const {changeLanguage} = useContext(AppContext);

  const theme: IObject<any> = useTheme();
  const styles = themeStyles(theme);
  const languageOptionsModalRef = React.useRef<Modalize>();

  const onLanguageMenuPress = (item: any) => {
    changeLanguage(item.code);
  };

  const onSettingPress = (item: any) => {
    switch (item.type) {
      case 'language':
        return languageOptionsModalRef.current?.open();
    }
  };

  return (
    <ScreenWrapper testID="DrawerComponent" style={styles.container} isFullView>
      <Container>
        <HeaderView
          firstLabel={user?.name}
          secondLabel={user?.email}
          avatar={{user}}
          style={styles.header}
        />
        <ViewSpacing height={spacing.margin.big} />
        <ListView type="menu" data={settings} onItemPress={onSettingPress} />
      </Container>
      <TransparentButton
        title={t('auth:text_sign_out')}
        onPress={() => dispatch(authActions.signOut())}
      />

      <Portal>
        <LanguageOptionsModal
          modalRef={languageOptionsModalRef}
          onMenuPress={onLanguageMenuPress}
        />
      </Portal>
    </ScreenWrapper>
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

export default Menu;
