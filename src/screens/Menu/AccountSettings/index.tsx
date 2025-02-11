import React, { useContext, useRef } from 'react';
import {
  FlatList, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BottomSheet from '~/baseComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Icon from '~/baseComponents/Icon';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';

import languages from '~/constants/languages';
import { AppContext } from '~/contexts/AppContext';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';

import { ILanguage, ISetting } from '~/interfaces/common';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import spacing from '~/theme/spacing';
import { accountSettingsMenu } from '~/screens/Menu/AccountSettings/constants';
import { openInAppBrowser } from '~/utils/link';
import { POLICY_URL } from '~/constants/url';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';

const AccoutSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const baseSheetRef: any = useRef();
  const { changeLanguage, language } = useContext(AppContext);
  const isInternetReachable = useNetworkStore(
    networkSelectors.getIsInternetReachable,
  );

  const onLanguageMenuPress = (item: ILanguage) => {
    changeLanguage(item.code);
  };

  const onAccountSettingsPress = (item: ISetting, e: any) => {
    switch (item.type) {
      case 'securityLogin':
        rootNavigation.navigate(menuStack.securityLogin);
        break;
      case 'language':
        baseSheetRef?.current?.open?.(e?.pageX, e?.pageY);
        break;
      case 'privacy':
        openInAppBrowser(POLICY_URL);
        break;
      case 'blocking':
        rootNavigation.navigate(menuStack.blocking);
        break;
      default:
        break;
    }
  };

  const renderLanguageOption = ({ item }: { item: ILanguage }) => (
    <TouchableOpacity onPress={() => onLanguageMenuPress(item)}>
      <MenuItem
        style={styles.languageOption}
        title={t(item.title)}
        icon={item.icon}
        RightComponent={
          language === item.code ? (
            <Icon icon="Check" size={24} tintColor={theme.colors.purple60} />
          ) : null
        }
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      disabled={!isInternetReachable}
      onPress={(e: any) => onAccountSettingsPress(item, e)}
    >
      <MenuItem
        testID="account_settings"
        title={item.title}
        icon={item.icon}
        rightSubTitle={item?.rightSubTitle}
        rightSubIcon={item?.rightSubIcon}
        iconProps={{ tintColor: colors.neutral20, size: 18 }}
      />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper testID="AccountSettings" style={styles.container} isFullView>
      <Header title={t('settings:title_account_settings')} />
      <FlatList
        scrollEnabled={false}
        data={accountSettingsMenu}
        renderItem={renderItem}
        keyExtractor={(item, index) => `footer_item_${index}`}
        style={styles.menuList}
      />
      <BottomSheet
        modalizeRef={baseSheetRef}
        ContentComponent={(
          <View testID="account_setting.bottom_sheet">
            <Text.ButtonS
              color={theme.colors.gray50}
              style={styles.chooseLanguageText}
              useI18n
            >
              settings:title_choose_language
            </Text.ButtonS>
            <Divider />
            <ListView
              type="primary"
              data={languages}
              renderItem={renderLanguageOption}
              onItemPress={onLanguageMenuPress}
            />
          </View>
  )}
      />
    </ScreenWrapper>
  );
};

export default AccoutSettings;

const styles = StyleSheet.create({
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
