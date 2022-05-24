import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useBackPressListener, useRootNavigation} from '~/hooks/navigation';
import {debounce} from 'lodash';
import Filter from '../../../beinComponents/Filter';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import JoinedCommunities from '~/screens/Groups/Communities/JoinedCommunities';
import DiscoverCommunities from '~/screens/Groups/Communities/DiscoverCommunities';
import {communityMenuData} from '~/constants/communityMenuData';
import ManagedCommunities from './ManagedCommunities';
import {ICommunity} from '~/interfaces/ICommunity';

const Communities: React.FC = () => {
  const headerRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const onShowSearch = (isShow: boolean) => {
    dispatch(
      groupsActions.setGroupSearch({
        isShow: isShow,
        loading: false,
        searchKey: '',
        result: [],
      }),
    );
  };

  const onSearchText = debounce((searchText: string) => {
    dispatch(groupsActions.setGroupSearch({searchKey: searchText}));
  }, 300);

  const onPress = (item: any, index: number) => {
    setSelectedIndex(index);
  };

  const onPressDiscover = () => {
    setSelectedIndex(2);
  };

  const onPressCommunities = (item: ICommunity) => {
    rootNavigation.navigate(groupStack.communityDetail, {
      communityId: item?.id || 0,
    });
  };

  const renderContent = () => {
    if (selectedIndex === 0) {
      return (
        <JoinedCommunities
          onPressCommunities={onPressCommunities}
          onPressDiscover={onPressDiscover}
        />
      );
    } else if (selectedIndex === 1) {
      return <ManagedCommunities onPressCommunities={onPressCommunities} />;
    } else if (selectedIndex === 2) {
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
        titleTextProps={{useI18n: true}}
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
      />
      <View style={{flex: 1}}>
        <Filter
          data={communityMenuData}
          selectedIndex={selectedIndex}
          onPress={onPress}
          testID="community_menu"
          itemTestID="item_community_data"
        />
        {renderContent()}
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    containerScreen: {
      flex: 1,
      backgroundColor: colors.background,
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
