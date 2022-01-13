import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SectionList, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import debounce from 'lodash/debounce';

import {useBaseHook} from '~/hooks';
import {useCreatePost} from '~/hooks/post';
import {ITheme} from '~/theme/interfaces';
import postActions from '~/screens/Post/redux/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SelectingAudiences from '~/screens/Post/components/SelectingAudiences';

import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {IGroup} from '~/interfaces/IGroup';
import {OnChangeCheckedGroupsData} from '~/beinComponents/GroupTree';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import {useRootNavigation} from '~/hooks/navigation';
import {IUser} from '~/interfaces/IAuth';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

const PostSelectAudience = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectingAudiences, setSelectingAudiences] = useState<
    (IGroup | IUser)[]
  >([]);
  const [selectingGroups, setSelectingGroups] = useState<{[x: string]: IGroup}>(
    {},
  );
  const [selectingUsers, setSelectingUsers] = useState<{[x: string]: IUser}>(
    {},
  );

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');
  const initAudiences = useKeySelector(
    postKeySelector.createPost.initAudiences,
  );

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const styles = createStyle(theme);

  const createPostData = useCreatePost();
  const {
    chosenAudiences,
    searchResultAudienceGroups,
    searchResultAudienceUsers,
  } = createPostData || {};

  const sectionListData: any = [];
  if (searchResultAudienceGroups?.length > 0) {
    sectionListData.push({
      title: t('post:label_groups'),
      data: searchResultAudienceGroups,
    });
  }
  if (searchResultAudienceUsers?.length > 0) {
    sectionListData.push({
      title: t('post:label_users'),
      data: searchResultAudienceUsers,
    });
  }

  const updateSelectingAudiences = () => {
    const newSelectingAudiences: (IUser | IGroup)[] = [];
    Object.values(selectingGroups).map((group: IGroup) => {
      if (group) {
        newSelectingAudiences.push(group);
      }
    });
    Object.values(selectingUsers).map((user: IUser) => {
      if (user) {
        newSelectingAudiences.push(user);
      }
    });
    setSelectingAudiences(newSelectingAudiences);
  };

  useEffect(() => {
    if (initAudiences) {
      handleSearchResult(initAudiences);
      setLoading(false);
    } else if (sectionListData.length === 0) {
      onSearch('');
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInternetReachable) {
      if (lossInternet && sectionListData.length === 0) {
        setLossInternet(false);
        onSearch('');
      }
    } else {
      setLossInternet(true);
    }
  }, [isInternetReachable]);

  useEffect(() => {
    if (selectingAudiences?.length === 0) {
      const newSelectingUsers: any = {};
      const newSelectingGroups: any = {};
      chosenAudiences?.map?.((item: any) => {
        if (item && item?.type === 'user') {
          newSelectingUsers[item.id] = item;
        } else {
          newSelectingGroups[item.id] = item;
        }
      });
      setSelectingUsers(newSelectingUsers);
      setSelectingGroups(newSelectingGroups);
    }
  }, [chosenAudiences]);

  useEffect(() => {
    updateSelectingAudiences();
  }, [selectingGroups]);

  useEffect(() => {
    updateSelectingAudiences();
  }, [selectingUsers]);

  const onPressSave = () => {
    dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
    rootNavigation.goBack();
  };

  const onRemoveItem = (item: any) => {
    if (item.type === 'user') {
      const newSelectingUsers: any = {...selectingUsers};
      newSelectingUsers[item.id] = false;
      setSelectingUsers(newSelectingUsers);
    } else {
      const newSelectingGroups: any = {...selectingGroups};
      newSelectingGroups[item.id] = false;
      setSelectingGroups(newSelectingGroups);
    }
  };

  const onChangeCheckedGroups = (data: OnChangeCheckedGroupsData) => {
    setSelectingGroups({...selectingGroups, ...data} as any);
  };

  const getSmallestChild = (
    smallestGroup: IGroup,
    newGroups: IGroup[],
    treeData: IGroup,
  ): any => {
    if (smallestGroup?.children?.[0]) {
      return getSmallestChild(
        smallestGroup?.children?.[0],
        newGroups,
        treeData,
      );
    } else {
      newGroups.push({...smallestGroup, treeData: treeData});
    }
  };

  const handleSearchResult = (data: any) => {
    const {users = [], groups = []} = data || {};

    dispatch(postActions.setSearchResultAudienceGroups(groups));

    const newListUsers: any = [];
    users?.map?.((item: any) => {
      newListUsers.push({
        id: item.id,
        type: 'user',
        name: item.fullname || item.username,
        avatar: item.avatar,
      });
    });
    dispatch(postActions.setSearchResultAudienceUsers(newListUsers));
  };

  const onSearch = debounce((searchText: string) => {
    setLoading(true);
    postDataHelper
      .getSearchAudiences(searchText)
      .then(response => {
        if (response && response.data) {
          handleSearchResult(response.data);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        console.log('\x1b[31m', '🐣️ getSearchAudiences |  : ', e, '\x1b[0m');
      });
  }, 500);

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onPressUser = (user: any) => {
    const newSelectingUsers: any = {...selectingUsers};
    if (newSelectingUsers[user.id]) {
      newSelectingUsers[user.id] = false;
    } else {
      newSelectingUsers[user.id] = user;
    }
    setSelectingUsers(newSelectingUsers);
  };

  const renderItem = ({item}: any) => {
    const {id, name, icon, avatar, type} = item || {};
    const isGroup = type !== 'user';

    if (isGroup) {
      return (
        <FlatGroupItem
          {...item}
          groupItemTestID="post_select_audience.groups.item"
          initShowTree={false}
          hidePath={false}
          selectingData={selectingGroups}
          showSmallestChild
          onChangeCheckedGroups={onChangeCheckedGroups}
        />
      );
    } else {
      return (
        <PrimaryItem
          showAvatar
          avatar={icon || avatar}
          avatarProps={{variant: isGroup ? 'largeAlt' : 'large'}}
          style={styles.item}
          title={name}
          onPressCheckbox={() => onPressUser(item)}
          onPress={() => onPressUser(item)}
          checkboxProps={{
            style: {position: 'absolute', left: 26, bottom: 0},
            isChecked: !!selectingUsers[id],
          }}
        />
      );
    }
  };

  const renderListHeader = () => {
    if (
      searchResultAudienceGroups?.length === 0 &&
      searchResultAudienceUsers?.length === 0
    ) {
      return null;
    }
    return (
      <Text.H6 style={{marginVertical: spacing?.margin.small}}>
        Search Results
      </Text.H6>
    );
  };

  const renderSectionHeader = ({section: {title}}: any) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text.H6 style={styles.sectionHeaderText}>{title}</Text.H6>
      </View>
    );
  };

  const renderListFooter = () => {
    return (
      <View>
        {loading && (
          <ActivityIndicator size={'large'} color={colors.borderDivider} />
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return <NoSearchResult />;
  };

  return (
    <ScreenWrapper isFullView style={styles.container}>
      <Header
        title={'post:select_audience'}
        titleTextProps={{useI18n: true}}
        buttonText={'common:btn_done'}
        buttonProps={{useI18n: true}}
        onPressButton={onPressSave}
        hideBackOnLaptop
      />
      <SearchInput
        autoFocus
        testID="post_select_audience.search"
        style={styles.searchInput}
        onChangeText={onChangeTextSearch}
        placeholder={t('post:search_audiences_placeholder')}
      />
      <SelectingAudiences
        list={selectingAudiences}
        onRemoveItem={onRemoveItem}
      />
      <SectionList
        style={{paddingHorizontal: spacing?.padding.large}}
        sections={sectionListData}
        keyExtractor={(item, index) =>
          item?.unique || `section_list_${item}_${index}`
        }
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmpty}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{height: spacing?.margin.large}} />
        )}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {},
    searchInput: {
      margin: spacing?.margin.base,
    },
    item: {
      height: undefined,
      paddingHorizontal: undefined,
    },
    sectionHeaderContainer: {
      backgroundColor: colors.background,
    },
    sectionHeaderText: {
      marginVertical: spacing?.margin.small,
    },
  });
};

export default PostSelectAudience;
