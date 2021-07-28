import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import debounce from 'lodash/debounce';

import {useBaseHook} from '~/hooks';
import {useCreatePost} from '~/hooks/post';
import {ITheme} from '~/theme/interfaces';
import {IAudience} from '~/interfaces/IPost';
import commonActions, {IAction} from '~/constants/commonActions';
import postActions from '~/screens/Post/redux/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SelectingAudiences from '~/screens/Post/components/SelectingAudiences';

import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {IGroup} from '~/interfaces/IGroup';

const PostSelectAudience = () => {
  const [listUser, setListUser] = useState([]);
  const [listGroups, setListGroups] = useState([]);
  const [selectingAudiences, setSelectingAudiences] = useState([]);

  const dispatch = useDispatch();
  const {navigation} = useBaseHook();
  const theme: ITheme = useTheme();
  const {spacing} = theme;
  const styles = createStyle(theme);

  const createPostData = useCreatePost();
  const {chosenAudiences} = createPostData || {};

  const sectionListData: any = [];
  if (listGroups?.length > 0) {
    sectionListData.push({title: 'Groups', data: listGroups});
  }
  if (listUser?.length > 0) {
    sectionListData.push({title: 'Users', data: listUser});
  }

  useEffect(() => {
    setSelectingAudiences(chosenAudiences);
  }, [chosenAudiences]);

  const onPressSave = () => {
    dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
    navigation.goBack();
  };

  const onRemoveItem = (item: IAudience) => {
    const newList =
      selectingAudiences?.filter?.(
        (selected: IAudience) =>
          !(selected?.id === item?.id && selected?.type === item?.type),
      ) || [];
    setSelectingAudiences(newList);
  };

  const onAddItem = (item: IAudience) => {
    const added = selectingAudiences?.find?.(
      (selected: IAudience) =>
        item?.id === selected?.id && item?.type === selected?.type,
    );
    if (!added) {
      const newList: any = [...(selectingAudiences || [])];
      newList.unshift(item);
      setSelectingAudiences(newList);
    }
  };

  const getSmallestChild = (
    smallestGroup: IGroup,
    newGroups: IGroup[],
  ): any => {
    if (smallestGroup?.children?.[0]) {
      return getSmallestChild(smallestGroup?.children?.[0], newGroups);
    } else {
      newGroups.push({...smallestGroup});
    }
  };

  const parseListGroup = (groups: any) => {
    const newGroups: any = [];
    groups?.map?.((item: IGroup) => {
      getSmallestChild(item, newGroups);
    });
    setListGroups(newGroups);
  };

  const onSearch = debounce((searchText: string) => {
    postDataHelper
      .getSearchAudiences(searchText)
      .then(response => {
        if (response && response.data) {
          const {users = [], groups = []} = response?.data || {};

          parseListGroup(groups);

          const newListUsers: any = [];
          users?.map?.((item: any) => {
            newListUsers.push({
              id: item.id,
              type: 'user',
              name: item.fullname || item.username,
              avatar: item.avatar,
            });
          });
          setListUser(newListUsers);
        }
      })
      .catch(e => {
        console.log('\x1b[36m', '🐣️ getSearchAudiences |  : ', e, '\x1b[0m');
      });
  }, 500);

  const onPressCheckbox = (item: IAudience, action: IAction) => {
    if (action === commonActions.checkBox) {
      onAddItem(item);
    } else {
      onRemoveItem(item);
    }
  };

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const renderItem = ({item, index}: any) => {
    const {id, name, icon, avatar, userCount, type} = item || {};
    const isGroup = type !== 'user';

    let CustomContent;
    if (isGroup) {
      CustomContent = (
        <View>
          <Text>Custom content</Text>
        </View>
      );
    }

    return (
      <PrimaryItem
        showAvatar
        avatar={icon || avatar}
        avatarProps={{variant: isGroup ? 'ultraLarge' : 'large'}}
        style={styles.item}
        title={name}
        onPressCheckbox={(action: IAction) => onPressCheckbox(item, action)}
        ContentComponent={CustomContent}
      />
    );
  };

  const renderListHeader = () => {
    if (listGroups?.length === 0 && listUser?.length === 0) {
      return null;
    }
    return (
      <Text.H5 style={{marginVertical: spacing?.margin.small}}>
        Search Results
      </Text.H5>
    );
  };

  const renderSectionHeader = ({section: {title}}: any) => {
    return (
      <Text.H6 style={{marginVertical: spacing?.margin.small}}>{title}</Text.H6>
    );
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
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    searchInput: {
      margin: spacing?.margin.base,
    },
    item: {
      height: undefined,
      paddingHorizontal: undefined,
    },
  });
};

export default PostSelectAudience;
