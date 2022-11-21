import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import i18next from 'i18next';
import spacing from '~/theme/spacing';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import ReorderArticlesInfo from './ReorderArticlesInfo';
import { IPost } from '~/interfaces/IPost';
import ArticleReorderItem, {
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from './ArticleReorderItem';
import ReorderList from '~/beinComponents/ReorderList';
import { isIndexEqualValue } from './helper';
import useSeriesStore from '~/screens/series/store';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { useRootNavigation } from '~/hooks/navigation';

const ReorderArticles = ({ route }: any) => {
  const { params } = route || {};
  const { seriesId } = params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { rootNavigation } = useRootNavigation();

  const loading = useSeriesStore((state) => state.loading);
  const series = usePostsStore(
    useCallback(postsSelector.getPost(seriesId, {}), [seriesId]),
  );
  const { id, articles } = series;

  const actions = useSeriesStore((state) => state.actions);

  const [articlesIndexOrderState, setArticlesIndexOrderState] = useState<number[]>([]);

  const [articlesOrderState, setArticlesOrderState] = useState(articles.reduce((acc, cur, index) => ({
    ...acc,
    [articles[index].id]: index,
  }), {}));

  const { t } = useBaseHook();

  const isChanged = !isIndexEqualValue(articlesIndexOrderState);

  const onPressSave = () => {
    Store.store.dispatch(modalActions.showAlert({
      title: i18next.t('series:notice_changing_the_order'),
      content: i18next.t('series:notice_sure_to_do_this'),
      cancelBtn: true,
      cancelLabel: i18next.t('common:btn_cancel'),
      confirmLabel: i18next.t('common:btn_confirm'),
      onConfirm: () => {
        actions.reorderArticles(id, articlesIndexOrderState);
      },
    }));
  };

  const handleBack = () => {
    if (isChanged) {
      Store.store.dispatch(modalActions.showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      }));
      return;
    }
    rootNavigation.goBack();
  };

  const renderItem = (article: IPost) => (
    <ArticleReorderItem
      key={`${uuid.v4()}`}
      index={articlesOrderState[article.id]}
      article={article}
    />
  );

  const onChange = (newIndex: number[]) => {
    setArticlesIndexOrderState(newIndex);
    const newArticlesOrderState = newIndex.reduce((acc, cur, index) => ({
      ...acc,
      [articles[cur].id]: index,
    }), articlesOrderState);
    setArticlesOrderState(newArticlesOrderState);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('series:reorder_article')}
        onPressButton={onPressSave}
        buttonText="common:btn_save"
        buttonProps={{
          loading,
          disabled: !isChanged,
          useI18n: true,
          style: styles.btnSave,
        }}
        onPressBack={handleBack}
      />
      <ReorderArticlesInfo />
      <ReorderList
        data={articles}
        renderItem={renderItem}
        itemWidth={ITEM_WIDTH}
        itemHeight={ITEM_HEIGHT}
        onChange={onChange}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    verticalLine: {
      width: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: spacing.margin.large,
      backgroundColor: colors.neutral5,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default ReorderArticles;
