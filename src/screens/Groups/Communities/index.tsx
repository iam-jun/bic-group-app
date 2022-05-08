import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, FlatList, RefreshControl} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import groupsActions from '~/screens/Groups/redux/actions';
import Header from '~/beinComponents/Header';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {useBackPressListener, useRootNavigation} from '~/hooks/navigation';
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
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';

const Communities: React.FC = () => {
  const headerRef = useRef<any>();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const myCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  useEffect(() => {
    getData();
  }, []);

  const handleBackPress = () => {
    headerRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  const getData = () => {
    dispatch(
      groupsActions.getMyCommunities({
        callback: () => {
          setRefreshing(false);
        },
      }),
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
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
        ButtonComponent={
          <ButtonWrapper
            testID="empty_screen.button"
            onPress={goToDiscover}
            style={styles.buttonWrapper}>
            <Text.ButtonBase useI18n color={theme.colors.bgButtonPrimary}>
              communities:empty_communities:button_text
            </Text.ButtonBase>
          </ButtonWrapper>
        }
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
        testID={`community_${item.id}`}
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
        <FlatList
          testID="flatlist"
          data={myCommunities}
          renderItem={renderItem}
          keyExtractor={(item, index) => `community_${item}_${index}`}
          ListEmptyComponent={renderEmptyComponent}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                marginVertical: theme.spacing?.margin.tiny,
                marginHorizontal: theme.spacing.margin.large,
              }}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.borderDisable}
            />
          }
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
    item: {
      height: '100%',
      flex: 1,
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
    buttonWrapper: {
      marginTop: spacing.margin.large,
    },
  });
};

export default Communities;
