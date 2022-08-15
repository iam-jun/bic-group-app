import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Header from '~/beinComponents/Header';
import TabView from '~/components/TabView';
import type { TabItem } from '~/components/TabView/Index';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import SearchCommunityView from '~/screens/communities/Communities/components/SearchCommunityView';
import spacing from '~/theme/spacing';
import DiscoverCommunities from '~/screens/Discover/DiscoverCommunities'
import YourCommunities from '~/screens/Discover/YourCommunities'

const dataTab: TabItem[] = [
  {
    key: 'discover-tab-1',
    title: 'discover:discover_communities',
  },
  {
    key: 'discover-tab-2',
    title: 'discover:your_communities',
  },
]

const Index = () => {
  const theme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseSearch = () => {
    setIsOpen(false);
  }

  const onPressCommunities = (communityId: string) => {
    rootNavigation.navigate(
      groupStack.communityDetail, { communityId },
    );
  };

  const onTabPress = (index: number) => {
    setSelectedIndex(index);
  }

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <DiscoverCommunities />
    }

    if (selectedIndex === 1) {
      return <YourCommunities />
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
        <View style={[styles.containerTabView, styles.bottomBorderAndShadow]}>
          <TabView
            data={dataTab}
            selectedIndex={selectedIndex}
            onTabPress={onTabPress}
          />
        </View>

        {renderContent()}
      </View>
      <SearchCommunityView
        isOpen={isOpen}
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
    bottomBorderAndShadow: {
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.neutral5,
      shadowOffset: { width: 0, height: 1 },
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
  });
};

export default Index;
