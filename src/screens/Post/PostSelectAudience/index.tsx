import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
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

const PostSelectAudience = () => {
  const [selectingAudiences, setSelectingAudiences] = useState<
    (IGroup | IUser)[]
  >([]);
  const [selectingGroups, setSelectingGroups] = useState<{[x: string]: IGroup}>(
    {},
  );
  const [selectingUsers, setSelectingUsers] = useState<{[x: string]: IUser}>(
    {},
  );

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;
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

  const onSearch = debounce((searchText: string) => {
    postDataHelper
      .getSearchAudiences(searchText)
      .then(response => {
        if (response && response.data) {
          const {users = [], groups = []} = response?.data || {};

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
        }
      })
      .catch(e => {
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
          avatarProps={{variant: isGroup ? 'ultraLarge' : 'large'}}
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
      <Text.H5 style={{marginVertical: spacing?.margin.small}}>
        Search Results
      </Text.H5>
    );
  };

  const renderSectionHeader = ({section: {title}}: any) => {
    return <Text.H6 style={styles.sectionHeader}>{title}</Text.H6>;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title={'post:select_audience'}
        titleTextProps={{useI18n: true}}
        buttonText={'post:save'}
        buttonProps={{useI18n: true}}
        onPressButton={onPressSave}
      />
      <SearchInput
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
        keyExtractor={(item, index) => `section_list_${item}_${index}`}
        ListHeaderComponent={renderListHeader}
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
    sectionHeader: {
      marginVertical: spacing?.margin.small,
      backgroundColor: colors.background,
    },
  });
};

export default PostSelectAudience;
