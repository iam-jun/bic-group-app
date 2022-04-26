import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {
  useBackPressListener,
  useRootNavigation,
  useTabPressListener,
} from '~/hooks/navigation';
import {ITabTypes} from '~/interfaces/IRouter';
import {debounce} from 'lodash';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import CommunityMenu from './components/CommunityMenu';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import privacyTypes from '~/constants/privacyTypes';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {useBaseHook} from '~/hooks';
import Divider from '~/beinComponents/Divider';
import modalActions from '~/store/modal/actions';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

const Communities: React.FC = () => {
  const listRef = useRef<any>();
  const headerRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const myCommunities = useKeySelector(groupsKeySelector.joinedCommunities);
  const loading = useKeySelector(groupsKeySelector.loadingCommunities);

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

  const onPressCommunities = (item: any) => {
    rootNavigation.navigate(groupStack.groups, {
      communityId: item?.id || 0,
    });
  };

  const onPressMenu = (item: any) => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderEmptyComponent = () => {
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_communities:title"
        description="communities:empty_communities:description"
        buttonTitle={'communities:empty_communities:button_text'}
        onPress={goToDiscover}
      />
    );
  };

  const renderItem = ({item}: any) => {
    const {name, icon, user_count, description, privacy} = item || {};
    const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
    const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

    return (
      <PrimaryItem
        showAvatar
        avatar={icon}
        avatarProps={{variant: 'largeAlt'}}
        subTitle={description}
        style={styles.item}
        title={name}
        onPress={() => onPressCommunities(item)}
        ContentComponent={
          <View style={styles.groupInfo}>
            <Icon
              style={styles.iconSmall}
              icon={privacyIcon}
              size={16}
              tintColor={theme.colors.iconTint}
            />
            <Text.Subtitle useI18n>{privacyTitle}</Text.Subtitle>
            <Text.Subtitle> • </Text.Subtitle>
            <Text.BodySM>{user_count}</Text.BodySM>
            <Text.Subtitle>{` ${t('groups:text_members')}`}</Text.Subtitle>
          </View>
        }
        onPressMenu={onPressMenu}
      />
    );
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
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <FlatList
            data={myCommunities}
            renderItem={renderItem}
            keyExtractor={(item, index) => `community_${item}_${index}`}
            ListEmptyComponent={renderEmptyComponent}
            ItemSeparatorComponent={() => (
              <Divider horizontal color={theme.colors.placeholder} />
            )}
          />
        )}
        <Divider horizontal color={theme.colors.placeholder} />
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
    item: {
      height: '100%',
      paddingVertical: spacing.padding.small,
    },
    iconSmall: {
      marginRight: spacing.margin.tiny,
      height: 16,
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default Communities;
