import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';

import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import Filter from '../../../beinComponents/Filter';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import JoinedCommunities from '~/screens/Groups/Communities/JoinedCommunities';
import DiscoverCommunities from '~/screens/Groups/Communities/DiscoverCommunities';
import { communityMenuData } from '~/constants/communityMenuData';
import ManagedCommunities from './ManagedCommunities';
import SearchCommunityView from './SearchCommunityView';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

const Communities: React.FC = () => {
  const headerRef = useRef<any>();

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useSharedValue(0);

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseSearch = React.useCallback(
    () => {
      setIsOpen(false);
    }, [],
  );

  const onPress = (
    item: any, index: number,
  ) => {
    setSelectedIndex(index);
    translateX.value = index * screenWidth;
  };

  const onPressDiscover = () => {
    setSelectedIndex(2);
    translateX.value = 2 * screenWidth;
  };

  const onPressCommunities = (communityId: string) => {
    rootNavigation.navigate(
      groupStack.communityDetail, { communityId },
    );
  };

  const renderContent = () => {
    if (selectedIndex === 0) {
      return (
        <JoinedCommunities
          onPressCommunities={onPressCommunities}
          onPressDiscover={onPressDiscover}
        />
      );
    } if (selectedIndex === 1) {
      return <ManagedCommunities onPressCommunities={onPressCommunities} />;
    } if (selectedIndex === 2) {
      return <DiscoverCommunities onPressCommunities={onPressCommunities} />;
    }
    return null;
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        hideBack
        headerRef={headerRef}
        title="tabs:communities"
        titleTextProps={{ useI18n: true }}
        rightIcon="iconSearch"
        onRightPress={onPressSearch}
      />
      <View style={{ flex: 1 }}>
        <Filter
          data={communityMenuData}
          activeIndex={selectedIndex}
          onPress={onPress}
          testID="community_menu"
          itemTestID="item_community_data"
          translateX={translateX}
        />
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
    groupContainer: {
      flex: 1,
    },
    searchInput: {
      flex: 1,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: spacing.margin.large,
    },
    dataList: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
  });
};

export default Communities;
