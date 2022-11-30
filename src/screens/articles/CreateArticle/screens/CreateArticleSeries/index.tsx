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
import { CreateArticleProps, IEditArticleSeries } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/CreateArticle/hooks/useEditArticle';
import spacing from '~/theme/spacing';
import SelectingSeries from './components/SelectingSeries';
import Divider from '~/beinComponents/Divider';
import ListSeriesWithAudiences from './components/ListSeriesWithAudiences';
import useCreateArticleSeriesStore from './store';
import useCreateArticleStore from '../../store';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import appConfig from '~/configs/appConfig';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

const CreateArticleSeries: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const articleId = route?.params?.articleId;

  const { rootNavigation } = useRootNavigation();

  const serieActions = useCreateArticleSeriesStore((state) => state.actions);
  const resetSeries = useCreateArticleSeriesStore((state) => state.reset);
  const selectedSeries = useCreateArticleStore((state) => state.data.series);
  const editArticleActions = useCreateArticleStore((state) => state.actions);
  const isPublishing = useCreateArticleStore((state) => state.isPublishing);

  const seriesData = useCreateArticleSeriesStore((state) => state.listSeries);
  const groupIds = useCreateArticleStore((state) => state.data.audience.groupIds);

  const { items: seriesItems, loading: loadingSeries } = seriesData || {};

  const searchData = useCreateArticleSeriesStore((state) => state.search);
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
    handleSave, handleBack, enableButtonSave, loading,
  } = useEditArticle({ articleId });

  const disabled = (isPublishing ? false : !enableButtonSave) || loading;

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
    rootNavigation.navigate(articleStack.createArticleContent, { articleId });
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

export default CreateArticleSeries;
