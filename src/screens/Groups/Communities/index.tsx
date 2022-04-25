import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {useBackPressListener, useTabPressListener} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import {debounce} from 'lodash';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import CommunityMenu from './components/CommunityMenu';

const Communities: React.FC = () => {
  const listRef = useRef<any>();
  const headerRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    getData();
  }, []);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'groups') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const getData = () => {
    dispatch(groupsActions.getMyCommunities());
  };

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

  const goToDiscover = () => {
    alert('goToDiscover');
  };

  const onPress = (item: any, index: number) => {
    setSelectedIndex(index);
    const {type = ''} = item || {};
    switch (type) {
      case 'COMMUNITIES':
        break;

      case 'MANAGE':
        break;

      case 'DISCOVER':
        break;
      default:
        break;
    }
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
        <CommunityMenu selectedIndex={selectedIndex} onPress={onPress} />
        <EmptyScreen
          source={'addUsers'}
          title="communities:empty_communities:title"
          description="communities:empty_communities:description"
          buttonTitle={'communities:empty_communities:button_text'}
          onPress={goToDiscover}
        />
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
