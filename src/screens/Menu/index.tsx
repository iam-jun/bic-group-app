import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/components/ScreenWrapper';
import {ILanguage, IObject, ISetting} from '~/interfaces/common';
import useAuth from '~/hooks/auth';
import HeaderView from '~/components/HeaderView';
import {spacing} from '~/theme';
import TransparentButton from '~/components/buttons/TransparentButton';
import {useBaseHook} from '~/hooks';
import * as authActions from '~/screens/Auth/redux/actions';
import ListView from '~/components/list/ListView';
import settings from '~/constants/settings';
import {Container, ViewSpacing} from '~/components';
import {AppContext} from '~/contexts/AppContext';
import OptionModal, {IOptionModal} from '~/components/modals/OptionModal';
import languages from '~/constants/languages';

const Menu = () => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {user} = useAuth();
  const {changeLanguage} = useContext(AppContext);

  const theme: IObject<any> = useTheme();
  const styles = themeStyles(theme);
  const languageOptionsModalRef = React.useRef<IOptionModal>();

  const onLanguageMenuPress = (item: ILanguage) => {
    changeLanguage(item.code);
  };

  const onSettingPress = (item: ISetting) => {
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
      <OptionModal
        ref={languageOptionsModalRef}
        optionData={languages}
        onOptionPress={onLanguageMenuPress}
      />
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
