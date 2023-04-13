import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import DiscoverCommunities from '~/screens/Discover/components/DiscoverCommunities';
import SearchDiscoverCommunity from './components/SearchDiscoverCommunity';
import TermsView from '~/components/TermsModal';

const Index = () => {
  const theme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();

  const [isOpenSearchCommunity, setIsOpenSearchCommunity] = useState(false);

  const onPressSearch = () => {
    setIsOpenSearchCommunity(true);
  };

  const onCloseSearch = () => {
    setIsOpenSearchCommunity(false);
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        removeBorderAndShadow
        title="discover:discover_community"
        titleTextProps={{ useI18n: true }}
        icon="iconSearch"
        onPressIcon={onPressSearch}
      />
      <View style={styles.containerContent}>
        <DiscoverCommunities />
      </View>
      <SearchDiscoverCommunity
        isOpen={isOpenSearchCommunity}
        onClose={onCloseSearch}
        placeholder={t('communities:text_search_communities')}
      />
      <TermsView />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    containerScreen: {
      flex: 1,
      backgroundColor: colors.white,
    },
    containerContent: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
  });
};

export default Index;
