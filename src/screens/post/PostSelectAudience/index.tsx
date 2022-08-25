import React, { useState, useEffect, FC } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBaseHook } from '~/hooks';

import postActions from '~/storeRedux/post/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SelectingAudiences from '~/screens/post/components/SelectingAudiences';

import { IGroup } from '~/interfaces/IGroup';
import { OnChangeCheckedGroupsData } from '~/beinComponents/GroupTree';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import { useRootNavigation } from '~/hooks/navigation';
import { IUser } from '~/interfaces/IAuth';
import NoSearchResult from '~/components/NoSearchResult';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import {
  checkChangeAudiences,
  ISelectAudienceParams,
} from './SelectAudienceHelper';
import { ICreatePostParams } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import spacing from '~/theme/spacing';
import useSelectAudienceStore from '~/screens/post/PostSelectAudience/store/selectAudienceStore';
import SearchInput from '~/baseComponents/Input/SearchInput';
import SelectAllAudience from '~/screens/post/components/SelectAllAudience';

export interface PostSelectAudienceProps {
  route?: {
    params?: ISelectAudienceParams;
  };
}

const PostSelectAudience: FC<PostSelectAudienceProps> = ({
  route,
}: PostSelectAudienceProps) => {
  const { isFirstStep, ...createPostParams } = route?.params || {};

  const [lossInternet, setLossInternet] = useState(false);

  const state = useKeySelector(postKeySelector.postSelectAudienceState);
  const { selectingAudiences, selectingGroups, selectingUsers } = state;

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');
  const initAudiences = useKeySelector(postKeySelector.createPost.initAudiences);
  const savedAudiences = useKeySelector(postKeySelector.createPost.chosenAudiences);

  const isEditAudience = !!initAudiences;

  // check audience has been changed, currently check only group
  // when allow select user as audience, this function should be updated
  const isAudiencesHasChanged = checkChangeAudiences(
    savedAudiences,
    selectingAudiences,
  );

  const disableButtonSave = selectingAudiences?.length === 0 || !isAudiencesHasChanged;

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const insets = useSafeAreaInsets();

  const createPostData = useKeySelector(postKeySelector.createPost.all);
  const { chosenAudiences } = createPostData || {};

  const {
    tree, search, dispatchGetAudienceTree, dispatchGetAudienceSearch,
  } = useSelectAudienceStore();
  const { data: dataTree = [], loading: loadingTree } = tree || {};
  const { data: dataSearch = [], loading: loadingSearch, key: searchKey } = search || {};

  const listData: IGroup[] = (!!searchKey ? dataSearch : dataTree) || [];
  const loading = !!searchKey ? loadingSearch : loadingTree;

  const updateSelectingAudiences = () => {
    const newSelectingAudiences: (IUser | IGroup)[] = [];
    Object.values(selectingGroups).forEach((group) => {
      if (group) {
        newSelectingAudiences.push(group as IGroup);
      }
    });
    Object.values(selectingUsers).forEach((user) => {
      if (user) {
        newSelectingAudiences.push(user as IUser);
      }
    });
    const p = { selectingAudiences: newSelectingAudiences };
    dispatch(postActions.setPostSelectAudienceState(p));
  };

  useEffect(
    () => {
      if (isFirstStep) {
        dispatch(postActions.clearCreatPostData());
        dispatchGetAudienceTree();
      } else {
        dispatch(postActions.setPostSelectAudienceState({ loading: false }));
      }

      // todo recheck flow edit post audience
      // if (initAudiences) {
      //   handleSearchResult(initAudiences);
      //   dispatch(postActions.setPostSelectAudienceState({ loading: false }));
      // }

      // else if (listData.length === 0 || isFirstStep) {
      //   onChangeTextSearch('');
      // }

      return () => {
        dispatch(postActions.setPostSelectAudienceState());
      };
    }, [],
  );

  useEffect(
    () => {
      if (isInternetReachable) {
        if (lossInternet && listData.length === 0) {
          setLossInternet(false);
          onSearch('');
        }
      } else {
        setLossInternet(true);
      }
    }, [isInternetReachable],
  );

  useEffect(
    () => {
      if (selectingAudiences?.length === 0) {
        const newSelectingUsers: any = {};
        const newSelectingGroups: any = {};
        chosenAudiences?.forEach?.((item: any) => {
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
    }, [chosenAudiences],
  );

  useEffect(
    () => {
      updateSelectingAudiences();
    }, [selectingGroups],
  );

  useEffect(
    () => {
      updateSelectingAudiences();
    }, [selectingUsers],
  );

  const onPressSave = () => {
    // first step in flow select audience before create post
    if (isFirstStep) {
      dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
      const params: ICreatePostParams = {
        ...createPostParams,
        initAutoSaveDraft: true,
      };
      rootNavigation.replace(
        homeStack.createPost, params as any,
      );
    } else if (isEditAudience) {
      if (isAudiencesHasChanged) {
        dispatch(modalActions.showAlert({
          title: t('post:create_post:title_audience_changed'),
          content: t('post:create_post:text_discard_change_audience'),
          cancelBtn: true,
          cancelLabel: t('common:btn_discard'),
          confirmLabel: t('post:create_post:btn_save_change'),
          onConfirm: () => {
            dispatch(postActions.setCreatePostChosenAudiences(selectingAudiences));
            rootNavigation.goBack();
          },
        }));
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
        dispatch(modalActions.showAlert({
          title: t('post:create_post:title_discard_audience'),
          content: t('post:create_post:text_discard_audience'),
          cancelBtn: true,
          cancelLabel: t('common:btn_discard'),
          confirmLabel: t('common:btn_stay_here'),
          onCancel: () => rootNavigation.goBack(),
        }));
      } else {
        rootNavigation.goBack();
      }
    } else if (isEditAudience || isFirstStep) {
      if (isAudiencesHasChanged) {
        dispatch(modalActions.showAlert({
          title: t('post:create_post:title_audience_changed'),
          content: t('post:create_post:text_discard_change'),
          cancelBtn: true,
          cancelLabel: t('common:btn_discard'),
          confirmLabel: t('common:btn_stay_here'),
          onCancel: () => rootNavigation.goBack(),
        }));
      } else {
        rootNavigation.goBack();
      }
    } else {
      rootNavigation.goBack();
    }
  };

  const onRemoveItem = (item: any) => {
    if (item.type === 'user') {
      const newSelectingUsers: any = { ...selectingUsers };
      newSelectingUsers[item.id] = false;
      const p = { selectingUsers: newSelectingUsers };
      dispatch(postActions.setPostSelectAudienceState(p));
    } else {
      const newSelectingGroups: any = { ...selectingGroups };
      newSelectingGroups[item.id] = false;
      const p = { selectingGroups: newSelectingGroups };
      dispatch(postActions.setPostSelectAudienceState(p));
    }
  };

  const onChangeCheckedGroups = (data: OnChangeCheckedGroupsData) => {
    const p = { selectingGroups: { ...selectingGroups, ...data } };
    dispatch(postActions.setPostSelectAudienceState(p));
  };

  const onSearch = debounce(
    (searchText: string) => {
      dispatchGetAudienceSearch(searchText);
    }, 500,
  );

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onPressUser = (user: any) => {
    const newSelectingUsers: any = { ...selectingUsers };
    if (newSelectingUsers[user.id]) {
      newSelectingUsers[user.id] = false;
    } else {
      newSelectingUsers[user.id] = user;
    }
    const p = { selectingUsers: newSelectingUsers };
    dispatch(postActions.setPostSelectAudienceState(p));
  };

  const renderItem = ({ item }: any) => {
    const {
      id, name, icon, avatar, type,
    } = item || {};
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
    }
    return (
      <PrimaryItem
        showAvatar
        avatar={icon || avatar}
        avatarProps={{ variant: isGroup ? 'large' : 'medium' }}
        style={styles.item}
        title={name}
        onPressCheckbox={() => onPressUser(item)}
        onPress={() => onPressUser(item)}
        checkboxProps={{
          style: { position: 'absolute', left: 26, bottom: 0 },
          isChecked: !!selectingUsers[id],
        }}
      />
    );
  };

  const renderListHeader = () => (
    <SelectAllAudience />
  );

  const renderListFooter = () => (
    <View>
      {loading && (
        <ActivityIndicator size="large" color={colors.neutral5} />
      )}
    </View>
  );

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
        enabled
        style={{ flex: 1 }}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? (insets?.bottom ? 90 : 60) : 0
        }
      >
        <Header
          title="post:select_audience"
          titleTextProps={{ useI18n: true }}
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
          size="large"
          style={styles.searchInput}
          testID="post_select_audience.search"
          onChangeText={onChangeTextSearch}
          placeholder={t('post:search_audiences_placeholder')}
        />
        <SelectingAudiences
          list={selectingAudiences}
          onRemoveItem={onRemoveItem}
        />
        <FlatList
          style={{ paddingHorizontal: spacing?.padding.large }}
          data={listData}
          keyExtractor={(
            item, index,
          ) => item?.id || `section_list_${item}_${index}`}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: spacing?.margin.large }} />
          )}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    searchInput: {
      margin: spacing?.margin.large,
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
