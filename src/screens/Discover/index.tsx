import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import spacing from '~/theme/spacing';
import DiscoverCommunities from '~/screens/Discover/components/DiscoverCommunities';
import YourCommunities from '~/screens/Discover/components/YourCommunities';
import YourGroups from './components/YourGroups';
import Managed from './components/Managed';
import Tab from '~/baseComponents/Tab';
import GlobalSearch from './components/GlobalSearch';
import { isGroup } from '../groups/helper';
import groupsActions from '~/storeRedux/groups/actions';

const HEADER_TAB = [
  { id: 'discover-tab-1', text: 'discover:discover_communities' },
  { id: 'discover-tab-2', text: 'discover:your_communities' },
  { id: 'discover-tab-3', text: 'discover:your_groups' },
  { id: 'discover-tab-4', text: 'discover:managed' },
];

const Index = () => {
  const theme = useTheme();
  const { elevations } = theme;
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const [isOpenSearchCommunity, setIsOpenSearchCommunity] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onPressSearch = () => {
    setIsOpenSearchCommunity(true);
  };

  const onCloseSearch = () => {
    setIsOpenSearchCommunity(false);
  };

  const onView = (item: any) => {
    if (isGroup(item.level)) {
      rootNavigation.navigate(groupStack.groupDetail, { groupId: item.id });
      return;
    }

    rootNavigation.navigate(groupStack.communityDetail, { communityId: item.id });
  };

  const onJoin = (item: any) => {
    if (isGroup(item.level)) {
      dispatch(groupsActions.joinNewGroup({ groupId: item.id, groupName: item.name }));
      return;
    }

    dispatch(
      groupsActions.joinCommunity({ communityId: item.id, communityName: item.name }),
    );
  };

  const onCancel = (item: any) => {
    if (isGroup(item.level)) {
      dispatch(groupsActions.cancelJoinGroup({ groupId: item.id, groupName: item.name }));
      return;
    }

    dispatch(
      groupsActions.cancelJoinCommunity({
        communityId: item.id,
        communityName: item.name,
      }),
    );
  };

  const onPressTab = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const renderContent = () => {
    if (selectedIndex === 0) {
      return <DiscoverCommunities />;
    }

    if (selectedIndex === 1) {
      return <YourCommunities />;
    }

    if (selectedIndex === 2) {
      return <YourGroups />;
    }

    if (selectedIndex === 3) {
      return <Managed />;
    }

    return null;
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        removeBorderAndShadow
        title="menu:title_discover"
        titleTextProps={{ useI18n: true }}
        icon="iconSearch"
        onPressIcon={onPressSearch}
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
      <GlobalSearch
        isOpen={isOpenSearchCommunity}
        placeholder={t('communities:text_search_communities')}
        onClose={onCloseSearch}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
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
