import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import Tab from '~/baseComponents/Tab';
import YourCommunities from './components/YourCommunities';
import YourGroups from './components/YourGroups';
import Managed from './components/Managed';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import SearchCommunity from './components/SearchCommunity';
import { ICON_SIZES } from '~/baseComponents/Button/constants';

const HEADER_TAB = [
  {
    id: 'community-tab-1',
    text: 'communities:community_menu:your_communities',
  },
  { id: 'community-tab-2', text: 'communities:community_menu:your_groups' },
  { id: 'community-tab-3', text: 'communities:community_menu:managed_groups' },
];

const Index = () => {
  const theme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const [isOpenSearchCommunity, setIsOpenSearchCommunity] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onPressSearch = () => {
    setIsOpenSearchCommunity(true);
  };

  const onCloseSearch = () => {
    setIsOpenSearchCommunity(false);
  };

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const onDiscoverButtonPress = () => {
    rootNavigation.navigate(menuStack.discover);
  };

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <YourCommunities />;
    }

    if (selectedIndex === 1) {
      return <YourGroups />;
    }

    if (selectedIndex === 2) {
      return <Managed />;
    }

    return null;
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        hideBack
        removeBorderAndShadow
        title="tabs:communities"
        titleTextProps={{ useI18n: true, style: styles.textHeader }}
        icon="search"
        onPressIcon={onPressSearch}
        buttonProps={{
          icon: 'CompassSolid',
          iconSize: ICON_SIZES.small,
          style: styles.buttonHeader,
        }}
        onPressButton={onDiscoverButtonPress}
      />
      <View style={styles.containerContent}>
        <View style={[styles.containerTabView]}>
          <Tab
            style={styles.tabs}
            buttonProps={{ type: 'primary', useI18n: true }}
            data={HEADER_TAB}
            type="pill"
            onPressTab={onPressTab}
            activeIndex={selectedIndex}
            isScrollToIndex
          />
        </View>
        {renderContent()}
      </View>
      <SearchCommunity
        isOpen={isOpenSearchCommunity}
        onClose={onCloseSearch}
        placeholder={t('communities:text_search_communities')}
      />
    </View>
  );
};

const SIZE_DISCOVER_BUTTON = 36;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  const elevation = Platform.OS === 'ios' ? elevations.e1 : null;

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
      ...elevation,
    },
    tabs: {
      alignItems: 'center',
      paddingHorizontal: spacing.margin.large,
    },
    textHeader: {
      marginLeft: spacing.margin.small,
    },
    buttonHeader: {
      marginLeft: spacing.margin.tiny,
      marginRight: spacing.margin.small,
      width: SIZE_DISCOVER_BUTTON,
    },
  });
};

export default Index;
