import React, { useContext, useRef } from 'react';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import BottomSheet from '~/baseComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Icon from '~/baseComponents/Icon';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
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
import getEnv from '~/utils/env';
import { openInAppBrowser } from '~/utils/link';

const POLICY_URL = `https://${getEnv('SELF_DOMAIN')}/policy`;

const GeneralSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const baseSheetRef: any = useRef();
  const { changeLanguage, language } = useContext(AppContext);

  const onLanguageMenuPress = (item: ILanguage) => {
    changeLanguage(item.code);
  };

  const onAccountSettingsPress = (
    item: ISetting, e: any,
  ) => {
    switch (item.type) {
      case 'securityLogin':
        return rootNavigation.navigate(menuStack.securityLogin);

      case 'language':
        baseSheetRef?.current?.open?.(
          e?.pageX, e?.pageY,
        );
        return;

      case 'privacy':
        openInAppBrowser(POLICY_URL);
    }
  };

  const renderLanguageOption = ({ item }: {item: ILanguage}) => (
    <TouchableOpacity onPress={() => onLanguageMenuPress(item)}>
      <MenuItem
        style={styles.languageOption}
        title={t(item.title)}
        icon={item.icon}
        RightComponent={
          language === item.code ? (
            <Icon
              icon="Check"
              size={24}
              tintColor={theme.colors.purple60}
            />
          ) : null
        }
      />
    </TouchableOpacity>
  );

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
        ContentComponent={(
          <View>
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

export default GeneralSettings;

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
