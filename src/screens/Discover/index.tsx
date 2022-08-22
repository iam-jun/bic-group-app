import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import SearchCommunityView from '~/screens/communities/Communities/components/SearchCommunityView';
import spacing from '~/theme/spacing';
import DiscoverCommunities from '~/screens/Discover/components/DiscoverCommunities'
import YourCommunities from '~/screens/Discover/components/YourCommunities'
import YourGroups from './components/YourGroups';
import Managed from './components/Managed'
import Tab from '~/baseComponents/Tab';

const HEADER_TAB = [
  { id: 'discover-tab-1', text: 'discover:discover_communities' },
  { id: 'discover-tab-2', text: 'discover:your_communities' },
  { id: 'discover-tab-3', text: 'discover:your_groups' },
  { id: 'discover-tab-4', text: 'discover:managed' },
]

const Index = () => {
  const theme = useTheme();
  const { elevations } = theme;
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const [isOpenSearchCommunity, setIsOpenSearchCommunity] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onPressSearch = () => {
    setIsOpenSearchCommunity(true);
  };

  const onCloseSearch = () => {
    setIsOpenSearchCommunity(false);
  }

  const onPressCommunities = (communityId: string) => {
    rootNavigation.navigate(
      groupStack.communityDetail, { communityId },
    );
  };

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index)
  }

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <DiscoverCommunities />
    }

    if (selectedIndex === 1) {
      return <YourCommunities />
    }

    if (selectedIndex === 2) {
      return <YourGroups />
    }

    if (selectedIndex === 3) {
      return <Managed />
    }

    return null;
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        removeBorderAndShadow
        title="menu:title_discover"
        titleTextProps={{ useI18n: true }}
        rightIcon="iconSearch"
        onRightPress={onPressSearch}
      />
      <View style={styles.containerContent}>
        <View style={[styles.containerTabView, elevations.e1]}>
          <Tab
            style={styles.tabs}
            buttonProps={{ type: 'primary', useI18n: true }}
            data={HEADER_TAB}
            type="pill"
            onPressTab={onPressTab}
            activeIndex={selectedIndex}
          />
        </View>

        {renderContent()}
      </View>
      <SearchCommunityView
        isOpen={isOpenSearchCommunity}
        onClose={onCloseSearch}
        onPressCommunity={onPressCommunities}
        placeholder={t('communities:text_search_communities')}
      />
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
    containerTabView: {
      paddingBottom: spacing.padding.small,
      backgroundColor: colors.white,
    },
    tabs: {
      alignItems: 'center',
      paddingHorizontal: spacing.margin.large,
    },
  });
};

export default Index;
