import React, {useContext, useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';

import languages from '~/constants/languages';
import {accountSettingsMenu} from '~/constants/settings';
import {AppContext} from '~/contexts/AppContext';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import {ITheme} from '~/theme/interfaces';
import {ILanguage, ISetting} from '~/interfaces/common';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import * as modalActions from '~/store/modal/actions';
import mainStack from '~/router/navigator/MainStack/stack';
import appActions from '~/store/app/actions';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';

const GeneralSettings = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const baseSheetRef: any = useRef();
  const {changeLanguage, language} = useContext(AppContext);

  const isFocused = useIsFocused();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);

  useEffect(() => {
    if (isFocused) dispatch(appActions.setRootScreenName('settings'));
  }, [isFocused]);

  const onLanguageMenuPress = (item: ILanguage) => {
    changeLanguage(item.code);
  };

  const onAccountSettingsPress = (item: ISetting, e: any) => {
    switch (item.type) {
      case 'userProfile':
        return rootNavigation.navigate(mainStack.userEdit, {
          userId: myProfileData?.id,
          params: {},
        });

      case 'securityLogin':
        return rootNavigation.navigate(menuStack.securityLogin);

      case 'language':
        baseSheetRef?.current?.open?.(e?.pageX, e?.pageY);
        return;

      default:
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const renderLanguageOption = ({item}: {item: ILanguage}) => {
    return (
      <TouchableOpacity onPress={() => onLanguageMenuPress(item)}>
        <MenuItem
          style={styles.languageOption}
          title={t(item.title)}
          icon={item.icon}
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
        itemTestID="account_settings"
        data={accountSettingsMenu}
        scrollEnabled={false}
        listStyle={styles.menuList}
        onItemPress={onAccountSettingsPress}
        showItemSeparator={false}
      />
      <BottomSheet
        modalizeRef={baseSheetRef}
        ContentComponent={
          <View>
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
              renderItem={renderLanguageOption}
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
    chooseLanguageText: {
      margin: spacing.margin.base,
      marginHorizontal: spacing.margin.extraLarge,
    },
    languageOption: {
      height: 48,
      paddingHorizontal: spacing.padding.extraLarge,
    },
  });
};
