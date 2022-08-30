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
import SelectingAudiences from '~/screens/post/components/SelectingAudiences';

import { IGroup } from '~/interfaces/IGroup';
import { OnChangeCheckedGroupsData } from '~/beinComponents/GroupTree';
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
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';

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
  const { selectingAudiences, selectingGroups } = state;

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
    tree, search, dispatchGetAudienceTree, dispatchGetAudienceSearch, reset: resetStore,
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

      return () => {
        dispatch(postActions.setPostSelectAudienceState());
        resetStore();
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
        const newSelectingGroups: any = {};
        chosenAudiences?.forEach?.((item: any) => {
          newSelectingGroups[item.id] = item;
        });

        const p = {
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
          title: t('discard_alert:title'),
          content: t('discard_alert:content'),
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
    const newSelectingGroups: any = { ...selectingGroups };
    newSelectingGroups[item.id] = false;
    const p = { selectingGroups: newSelectingGroups };
    dispatch(postActions.setPostSelectAudienceState(p));
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

  const renderItem = ({ item }: any) => (
    <FlatGroupItem
      {...item}
      groupItemTestID="post_select_audience.groups.item"
      initShowTree={!searchKey}
      checkboxDisabled={!searchKey && !item.isPostable} // api search return all groups user can post to
      disableOnPressItem={!item.isPostable}
      hidePath
      groupStyle={{ paddingVertical: spacing.padding.small }}
      showPrivacyAvatar
      selectingData={selectingGroups}
      onChangeCheckedGroups={onChangeCheckedGroups}
    />
  );

  const renderListFooter = () => (
    <View style={{ marginBottom: spacing.margin.large }}>
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
          title="post:title_post_to"
          titleTextProps={{ useI18n: true }}
          buttonText="common:btn_next"
          buttonProps={{
            useI18n: true,
            disabled: disableButtonSave,
            testID: 'select_audience.btn_done',
          }}
          onPressButton={onPressSave}
          onPressBack={onPressBack}
        />
        <SearchInput
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
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
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
