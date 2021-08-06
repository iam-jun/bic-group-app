import React, {useRef, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {accountSettingsMenu} from '~/constants/settings';
import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {ILanguage, ISetting} from '~/interfaces/common';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import {AppContext} from '~/contexts/AppContext';
import languages from '~/constants/languages';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import AlertModal from '~/beinComponents/modals/AlertModal';
import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';

const GeneralSettings = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const baseSheetRef: any = useRef();
  const {changeLanguage, language} = useContext(AppContext);

  const onLanguageMenuPress = (item: ILanguage) => {
    changeLanguage(item.code);
  };

  const onAccountSettingsPress = (item: ISetting) => {
    switch (item.type) {
      case 'userProfile':
        return rootNavigation.navigate(mainStack.userProfile);

      case 'language':
        return baseSheetRef.current?.open?.();

      default:
        dispatch(
          modalActions.showAlert({
            title: 'Info',
            content:
              'Function has not been developed. Stay tuned for further releases 😀',
            onConfirm: () => dispatch(modalActions.hideAlert()),
            confirmLabel: 'Got it',
          }),
        );
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
      <AlertModal />
      <BottomSheet
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
