/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useLayoutEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  Keyboard, ScrollView, StyleSheet, View,
} from 'react-native';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import SearchFilterContentTypeSection from './components/SearchFilterContentTypeSection';
import useSearchStore from '../../store';
import SearchFilterGroupSection from './components/SearchFilterGroupSection';
import SearchFilterTagsSection from './components/SearchFilterTagsSection';
import SearchFilterCreatedBySection from './components/SearchFilterCreatedBySection';
import SearchFilterTopicsSection from './components/SearchFilterTopicsSection';
import SearchFilterDatePostedSection from './components/SearchFilterDatePostedSection';
import Footer from './components/Footer';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import showAlert from '~/store/helper/showAlert';

type SearchFilterMainProps = {
    route: {
    params: {
     searchScreenKey: string;
    };
  };
};

const SearchFilterMain: FC<SearchFilterMainProps> = ({ route }) => {
  const { searchScreenKey } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const actionsSearchStore = useSearchStore((state) => state.actions);

  const onPressBack = () => {
    const isFilterChanged = actionsSearchStore.isFilterChangedByScreenKey(searchScreenKey);

    if (isFilterChanged) {
      Keyboard.dismiss();
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          rootNavigation.goBack();
        },
      });
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(onPressBack);

  useLayoutEffect(() => {
    actionsSearchStore.initTempFilterByScreenKey(searchScreenKey);
  }, []);

  useEffect(() => () => actionsSearchStore.removeTempFilterByScreenKey(searchScreenKey), []);

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="search:filters"
        onPressBack={onPressBack}
        removeBorderAndShadow
      />
      <ViewSpacing height={spacing.margin.small} />
      <ScrollView alwaysBounceVertical={false} style={styles.container}>
        <SearchFilterContentTypeSection searchScreenKey={searchScreenKey} />
        <SearchFilterGroupSection searchScreenKey={searchScreenKey} />
        <SearchFilterTagsSection searchScreenKey={searchScreenKey} />
        <SearchFilterTopicsSection searchScreenKey={searchScreenKey} />
        <SearchFilterCreatedBySection searchScreenKey={searchScreenKey} />
        <SearchFilterDatePostedSection searchScreenKey={searchScreenKey} />
      </ScrollView>
      <Footer searchScreenKey={searchScreenKey} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
  });
};

export default SearchFilterMain;
