import React, {useState, useEffect, FC} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  DeviceEventEmitter,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import debounce from 'lodash/debounce';

import {useBaseHook} from '~/hooks';

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
import modalActions from '~/store/modal/actions';
import {
  checkChangeAudiences,
  ISelectAudienceParams,
} from './SelectAudienceHelper';
import {ICreatePostParams} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import spacing from '~/theme/spacing';

export interface PostSelectAudienceProps {
  route?: {
    params?: ISelectAudienceParams;
  };
}

const PostSelectAudience: FC<PostSelectAudienceProps> = ({
  route,
}: PostSelectAudienceProps) => {
  const {isFirstStep, ...createPostParams} = route?.params || {};

  const [lossInternet, setLossInternet] = useState(false);

  const state = useKeySelector(postKeySelector.postSelectAudienceState);
  const {loading, selectingAudiences, selectingGroups, selectingUsers} = state;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');
  const initAudiences = useKeySelector(
    postKeySelector.createPost.initAudiences,
  );
  const savedAudiences = useKeySelector(
    postKeySelector.createPost.chosenAudiences,
  );

  const isEditAudience = !!initAudiences;

  // check audience has been changed, currently check only group
  // when allow select user as audience, this function should be updated
  const isAudiencesHasChanged = checkChangeAudiences(
    savedAudiences,
    selectingAudiences,
  );

  const disableButtonSave =
    selectingAudiences?.length === 0 || !isAudiencesHasChanged;

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  const insets = useSafeAreaInsets();

  const createPostData = useKeySelector(postKeySelector.createPost.all);
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
    Object.values(selectingGroups).map(group => {
      if (group) {
        newSelectingAudiences.push(group as IGroup);
      }
    });
    Object.values(selectingUsers).map(user => {
      if (user) {
        newSelectingAudiences.push(user as IUser);
      }
    });
    const p = {selectingAudiences: newSelectingAudiences};
    dispatch(postActions.setPostSelectAudienceState(p));
  };

  useEffect(() => {
    if (isFirstStep) {
      dispatch(postActions.clearCreatPostData());
      dispatch(postActions.setSearchResultAudienceGroups([]));
      dispatch(postActions.setSearchResultAudienceUsers([]));
    }
    if (initAudiences) {
      handleSearchResult(initAudiences);
      dispatch(postActions.setPostSelectAudienceState({loading: false}));
    } else if (sectionListData.length === 0 || isFirstStep) {
      onSearch('');
    } else {
      dispatch(postActions.setPostSelectAudienceState({loading: false}));
    }

    setTimeout(() => {
      //emit event show header to avoid case quick scroll then press create, lead to missing header
      DeviceEventEmitter.emit('showHeader', true);
      DeviceEventEmitter.emit('showBottomBar', true);
    }, 2000);

    return () => {
      dispatch(postActions.setPostSelectAudienceState());
    };
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

      const p = {
        selectingUsers: newSelectingUsers,
        selectingGroups: newSelectingGroups,
      };
      dispatch(postActions.setPostSelectAudienceState(p));
    }
  }, [chosenAudiences]);

  useEffect(() => {
    updateSelectingAudiences();
  }, [selectingGroups]);

  useEffect(() => {
    updateSelectingAudiences();
  }, [selectingUsers]);

  const onPressSave = () => {
    // first step in flow select audience before create post
    if (isFirstStep) {
      dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
      const params: ICreatePostParams = {
        ...createPostParams,
        initAutoSaveDraft: true,
      };
      rootNavigation.replace(homeStack.createPost, params as any);
    } else if (isEditAudience) {
      if (isAudiencesHasChanged) {
        dispatch(
          modalActions.showAlert({
            title: t('post:create_post:title_audience_changed'),
            content: t('post:create_post:text_discard_change_audience'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: t('common:btn_discard'),
            confirmLabel: t('post:create_post:btn_save_change'),
            onConfirm: () => {
              dispatch(
                postActions.setCreatePostChosenAudiences(selectingAudiences),
              );
              rootNavigation.goBack();
            },
          }),
        );
      } else {
        dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
        rootNavigation.goBack();
      }
    } else {
      dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
      rootNavigation.goBack();
    }
  };

  const onPressBack = () => {
    if (isFirstStep) {
      if (isAudiencesHasChanged) {
        dispatch(
          modalActions.showAlert({
            title: t('post:create_post:title_discard_audience'),
            content: t('post:create_post:text_discard_audience'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: t('common:btn_discard'),
            confirmLabel: t('post:create_post:btn_keep_selecting'),
            onDismiss: () => rootNavigation.goBack(),
          }),
        );
      } else {
        rootNavigation.goBack();
      }
    } else if (isEditAudience || isFirstStep) {
      if (isAudiencesHasChanged) {
        dispatch(
          modalActions.showAlert({
            title: t('post:create_post:title_audience_changed'),
            content: t('post:create_post:text_discard_change'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: t('common:btn_discard'),
            confirmLabel: t('post:create_post:btn_keep_edit'),
            onDismiss: () => rootNavigation.goBack(),
          }),
        );
      } else {
        rootNavigation.goBack();
      }
    } else {
      rootNavigation.goBack();
    }
  };

  const onRemoveItem = (item: any) => {
    if (item.type === 'user') {
      const newSelectingUsers: any = {...selectingUsers};
      newSelectingUsers[item.id] = false;
      const p = {selectingUsers: newSelectingUsers};
      dispatch(postActions.setPostSelectAudienceState(p));
    } else {
      const newSelectingGroups: any = {...selectingGroups};
      newSelectingGroups[item.id] = false;
      const p = {selectingGroups: newSelectingGroups};
      dispatch(postActions.setPostSelectAudienceState(p));
    }
  };

  const onChangeCheckedGroups = (data: OnChangeCheckedGroupsData) => {
    const p = {selectingGroups: {...selectingGroups, ...data}};
    dispatch(postActions.setPostSelectAudienceState(p));
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
    dispatch(postActions.setPostSelectAudienceState({loading: true}));
    postDataHelper
      .getSearchAudiences(searchText)
      .then(response => {
        if (response && response.data) {
          handleSearchResult(response.data);
        }
        dispatch(postActions.setPostSelectAudienceState({loading: false}));
      })
      .catch(e => {
        dispatch(postActions.setPostSelectAudienceState({loading: false}));
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
    const p = {selectingUsers: newSelectingUsers};
    dispatch(postActions.setPostSelectAudienceState(p));
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
          <ActivityIndicator size={'large'} color={colors.neutral5} />
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={true}
        style={{flex: 1}}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? (!!insets?.bottom ? 90 : 60) : 0
        }>
        <Header
          title={'post:select_audience'}
          titleTextProps={{useI18n: true}}
          buttonText={isFirstStep ? 'common:btn_next' : 'common:btn_done'}
          buttonProps={{
            useI18n: true,
            disabled: disableButtonSave,
            testID: 'select_audience.btn_done',
          }}
          onPressButton={onPressSave}
          onPressBack={onPressBack}
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
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
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
      backgroundColor: colors.white,
    },
    sectionHeaderText: {
      marginVertical: spacing?.margin.small,
    },
  });
};

export default PostSelectAudience;
