import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import useCreatePostStore from '../CreatePost/store';
import { useBaseHook } from '~/hooks';
import { IAudience, ICreatePostSeries } from '~/interfaces/IPost';
import useCreatePost from '../CreatePost/hooks/useCreatePost';
import appConfig from '~/configs/appConfig';
import Header from '~/beinComponents/Header';
import { SearchInput } from '~/baseComponents/Input';
import Divider from '~/beinComponents/Divider';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import { spacing } from '~/theme';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { ListSeriesWithAudiences } from '~/components/SelectSeries';
import useSelectSeriesStore from '~/components/SelectSeries/store';
import SelectingListInfo from '~/components/SelectingListInfo';

const CreatePostSeries = () => {
  const { rootNavigation } = useRootNavigation();

  const serieActions = useSelectSeriesStore((state) => state.actions);
  const resetSeries = useSelectSeriesStore((state) => state.reset);

  const tempSelectedSeries = useCreatePostStore(
    (state) => state.tempData.series,
  );
  const chosenAudiences = useCreatePostStore(
    (state) => state.createPost.chosenAudiences,
  );
  const loading = useCreatePostStore((state) => state.loading);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const seriesData = useSelectSeriesStore((state) => state.listSeries);
  const { items: seriesItems, loading: loadingSeries } = seriesData || {};

  const searchData = useSelectSeriesStore((state) => state.search);
  const {
    key: searchKey,
    items: searchItems,
    loading: loadingSearch,
  } = searchData || {};

  const listData = searchKey ? searchItems : seriesItems;

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const chosenGroups = chosenAudiences.filter(
    (item: IAudience) => item.type !== 'user',
  );
  const chosenGroupIds = chosenGroups.map((group) => group.id);

  useEffect(() => {
    createPostStoreActions.initSeriesTempData();
  }, []);

  useEffect(() => {
    if (chosenGroupIds?.length > 0) {
      serieActions.getSeries(false, { groupIds: chosenGroupIds });
    }
  }, []);

  useEffect(
    () => () => {
      resetSeries();
      createPostStoreActions.clearSeriesTempData();
    },
    [],
  );

  const {
    saveSelectedSeries,
    enableButtonSaveSeries,
    handleBackWhenSelectingSeries,
  } = useCreatePost();

  const disabled = !enableButtonSaveSeries || loading;

  useBackPressListener(handleBackWhenSelectingSeries);

  const onSearch = debounce((searchText: string) => {
    serieActions.searchSeries({
      groupIds: chosenGroupIds,
      contentSearch: searchText,
    });
  }, appConfig.searchTriggerTime);

  const onLoadMore = debounce(() => {
    serieActions.getSeries(true, { groupIds: chosenGroupIds });
  }, appConfig.searchTriggerTime);

  const onRemoveSeries = (series: ICreatePostSeries) => {
    createPostStoreActions.removeSeriesTempData(series);
  };

  const handleCheckedItem = (isChecked: boolean, item: any) => {
    const newSeries = { id: item?.id, title: item?.title };
    if (isChecked) {
      createPostStoreActions.addSeriesToTempData(newSeries);
    } else {
      onRemoveSeries(newSeries);
    }
  };

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const onPressButtonSave = () => {
    saveSelectedSeries();
    rootNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_series')}
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={onPressButtonSave}
        onPressBack={handleBackWhenSelectingSeries}
      />
      <SearchInput
        size="large"
        style={styles.searchInput}
        testID="post_select_audience.search"
        onChangeText={onChangeTextSearch}
        placeholder={t('article:text_search_category_placeholder')}
      />
      <SelectingListInfo
        data={tempSelectedSeries}
        type="series"
        title={t('post:text_selecting_will_be_added_to')}
        tagProps={{
          type: 'neutral',
          textProps: {
            numberOfLines: 1,
            style: styles.tagTextStyle,
          },
        }}
        onRemoveItem={onRemoveSeries}
      />
      <Divider style={styles.divider} />
      <ListSeriesWithAudiences
        data={listData}
        selectedData={tempSelectedSeries}
        loading={loadingSeries || loadingSearch}
        onCheckedItem={handleCheckedItem}
        onLoadMore={onLoadMore}
      />
      <KeyboardSpacer iosOnly />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    searchInput: {
      margin: spacing?.margin.large,
    },
    divider: {
      backgroundColor: colors.neutral5,
      marginTop: spacing.margin.small,
    },
    tagTextStyle: {
      color: colors.neutral60,
      flexShrink: 1,
      paddingLeft: spacing.margin.tiny,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default CreatePostSeries;
