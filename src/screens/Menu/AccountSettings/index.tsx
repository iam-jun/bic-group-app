import React, {useContext, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';

import languages from '~/constants/languages';
import {accountSettingsMenu} from '~/constants/settings';
import {AppContext} from '~/contexts/AppContext';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import useMenu from '~/hooks/menu';
import menuActions from '~/screens/Menu/redux/actions';
import {ITheme} from '~/theme/interfaces';
import {ILanguage, ISetting} from '~/interfaces/common';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import * as modalActions from '~/store/modal/actions';

const GeneralSettings = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const baseSheetRef: any = useRef();
  const {changeLanguage, language} = useContext(AppContext);
  const {isLanguageModalOpen} = useMenu();

  const onLanguageModalClose = () => {
    dispatch(menuActions.setLanguageModalOpen(false));
  };

  const onLanguageMenuPress = (item: ILanguage) => {
    changeLanguage(item.code);
  };

  const onAccountSettingsPress = (item: ISetting) => {
    switch (item.type) {
      case 'userProfile':
        return rootNavigation.navigate(menuStack.userProfile);

      case 'securityLogin':
        return rootNavigation.navigate(menuStack.securityLogin);

      case 'language':
        dispatch(menuActions.setLanguageModalOpen(true));
        return;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const renderItem = ({item}: {item: ILanguage}) => {
    return (
      <TouchableOpacity onPress={() => onLanguageMenuPress(item)}>
        <PrimaryItem
          title={t(item.title)}
          RightComponent={
            language === item.code ? (
              <Icon
                icon={'Check'}
                size={24}
                tintColor={theme.colors.primary7}
              />
            ) : null
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper testID="AccountSettings" style={styles.container} isFullView>
      <Header title={t('settings:title_account_settings')} />
      <ListView
        type="menu"
        data={accountSettingsMenu}
        scrollEnabled={false}
        listStyle={styles.menuList}
        onItemPress={onAccountSettingsPress}
      />
      <BottomSheet
        isOpen={isLanguageModalOpen}
        onClose={onLanguageModalClose}
        modalizeRef={baseSheetRef}
        ContentComponent={
          <View style={styles.contentComponent}>
            <Text.ButtonSmall
              color={theme.colors.textSecondary}
              style={styles.chooseLanguageText}
              useI18n>
              settings:title_choose_language
            </Text.ButtonSmall>
            <Divider />
            <ListView
              type="primary"
              data={languages}
              renderItem={renderItem}
              onItemPress={onLanguageMenuPress}
            />
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default GeneralSettings;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {},
    menuList: {
      marginTop: spacing.margin.base,
    },
    contentComponent: {
      marginHorizontal: spacing.margin.base,
    },
    chooseLanguageText: {
      margin: spacing.margin.base,
    },
  });
};
