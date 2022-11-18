import React, { FC, useEffect } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import { SearchInput } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { EditArticleProps, IEditArticleSeries } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import spacing from '~/theme/spacing';
import SelectingSeries from './components/SelectingSeries';
import Divider from '~/beinComponents/Divider';
import ListSeriesWithAudiences from './components/ListSeriesWithAudiences';
import useEditArticleSeriesStore from './store';
import useEditArticleStore from '../store';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import appConfig from '~/configs/appConfig';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

const EditArticleSeries: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const { rootNavigation } = useRootNavigation();

  const serieActions = useEditArticleSeriesStore((state) => state.actions);
  const resetSeries = useEditArticleSeriesStore((state) => state.reset);
  const selectedSeries = useEditArticleStore((state) => state.data.series);
  const editArticleActions = useEditArticleStore((state) => state.actions);
  const isPublishing = useEditArticleStore((state) => state.isPublishing);

  const seriesData = useEditArticleSeriesStore((state) => state.listSeries);
  const groupIds = useEditArticleStore((state) => state.data.audience.groupIds);

  const { items: seriesItems, loading: loadingSeries } = seriesData || {};

  const searchData = useEditArticleSeriesStore((state) => state.search);
  const { key: searchKey, items: searchItems, loading: loadingSearch } = searchData || {};

  const listData = searchKey ? searchItems : seriesItems;

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  useEffect(() => {
    serieActions.getSeries(false, { groupIds });
  }, [groupIds]);

  useEffect(() => () => {
    resetSeries();
  }, []);

  const {
    handleSave, handleBack, enableButtonSave, loading, enableButtonNext,
  } = useEditArticle({ articleId });

  const disabled = (isPublishing ? !enableButtonNext : !enableButtonSave) || loading;

  useBackPressListener(handleBack);

  const onSearch = debounce(
    (searchText: string) => {
      serieActions.searchSeries({ groupIds, contentSearch: searchText });
    }, appConfig.searchTriggerTime,
  );

  const onLoadMore = debounce(() => {
    serieActions.getSeries(true, { groupIds });
  }, appConfig.searchTriggerTime);

  const onRemoveSeries = (series: IEditArticleSeries) => {
    editArticleActions.removeSeries(series);
  };

  const handleCheckedItem = (isChecked: boolean, item: any) => {
    const newSeries = { id: item?.id, title: item?.title };
    if (isChecked) {
      editArticleActions.addSeries(newSeries);
    } else {
      onRemoveSeries(newSeries);
    }
  };

  const onChangeTextSearch = (text: string) => {
    onSearch(text);
  };

  const goNextStep = () => {
    rootNavigation.navigate(articleStack.editArticleContent, { articleId });
  };

  const goBack = () => {
    rootNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_series')}
        buttonProps={{ disabled, loading }}
        buttonText={t(isPublishing ? 'common:btn_next' : 'common:btn_save')}
        onPressButton={isPublishing ? goNextStep : handleSave}
        onPressBack={isPublishing ? goBack : handleBack}
      />
      <SearchInput
        size="large"
        style={styles.searchInput}
        testID="post_select_audience.search"
        onChangeText={onChangeTextSearch}
        placeholder={t('article:text_search_category_placeholder')}
      />
      <SelectingSeries data={selectedSeries} onRemoveItem={onRemoveSeries} />
      <Divider style={styles.divider} />
      <ListSeriesWithAudiences
        data={listData}
        selectedData={selectedSeries}
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
  });
};

export default EditArticleSeries;
