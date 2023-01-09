import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button } from '~/baseComponents';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { IAudienceGroup } from '~/interfaces/IPost';
import AlertDeleteAudiencesConfirmContent from '~/components/posts/AlertDeleteAudiences';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import modalActions from '~/storeRedux/modal/actions';
import DeletedItem from '../../../components/series/DeletedItem';
import SeriesDetailHeader from './components/SeriesDetailHeader';
import SeriesDetailArticleItem from './components/SeriesDetailArticleItem';
import useSeriesStore, { ISeriesState } from '../store';
import useSeriesMenu from '~/hooks/useSeriesMenu';
import { spacing } from '~/theme';
import AddArticles from './components/AddArticles';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import ContentUnavailable from '~/components/ContentUnavailable';
import useMounted from '~/hooks/mounted';

const SeriesDetail = ({ route }: any) => {
  const { params } = route || {};
  const { seriesId } = params || {};
  const theme = useTheme();
  const styles = createStyle(theme);
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const series = usePostsStore(useCallback(postsSelector.getPost(seriesId, {}), [seriesId]));

  const {
    actor, id, deleted, audience, articles = [],
  } = series;
  const { actions, errors } = useSeriesStore((state: ISeriesState) => state);
  const isFetchError = errors[seriesId];

  const isMounted = useMounted();

  const isActor = actor?.id == userId;

  useEffect(() => {
    if (isMounted) { actions.getSeriesDetail(seriesId); }
  }, [isMounted]);

  const onPressSearch = () => {
    setIsOpenSearch(true);
  };

  const onCloseSearch = () => {
    setIsOpenSearch(false);
  };

  const { shouldHavePermissionOnSomeAudience } = useMyPermissionsStore((state) => state.actions);

  const canDeleteOwnPost = shouldHavePermissionOnSomeAudience(
    audience?.groups,
    PermissionKey.CRUD_POST_ARTICLE,
  );

  const handleError = (listIdAudiences: string[]) => {
    if (listIdAudiences?.length <= 0 || audience?.groups?.length <= 0) {
      return;
    }

    const listAudiences = listIdAudiences.map((audienceId) => {
      const _audience = audience.groups.find(
        (audience: IAudienceGroup) => audience?.id === audienceId,
      );
      return _audience;
    });
    if (canDeleteOwnPost) {
      dispatch(
        modalActions.showAlert({
          title: t('series:title_delete_audiences_of_series'),
          children: (
            <AlertDeleteAudiencesConfirmContent
              data={listAudiences}
              textContent={t('series:content_delete_audiences_of_series')}
            />
          ),
          cancelBtn: true,
          confirmLabel: t('common:text_remove'),
          ConfirmBtnComponent: Button.Danger,
          onConfirm: () => actions.removeAudiences(id, listIdAudiences),
          confirmBtnProps: { type: 'ghost' },
        }),
      );
    } else {
      dispatch(
        modalActions.showAlert({
          title: t('series:title_delete_audiences_of_series'),
          children: (
            <AlertDeleteAudiencesConfirmContent
              data={listAudiences}
              textContent={t('series:content_not_able_delete_of_series')}
            />
          ),
          cancelBtn: true,
          cancelLabel: t('common:btn_close'),
          onConfirm: null,
        }),
      );
    }
  };

  const handleConfirmDelete = () => {
    actions.deleteSeries(id, handleError);
  };

  const { showMenu } = useSeriesMenu(series, isActor, true, handleConfirmDelete);

  if (deleted) {
    return (
      <View style={styles.container}>
        <Header />
        <DeletedItem />
      </View>
    );
  }

  const _renderHeaderComponent = () => <SeriesDetailHeader series={series} />;

  const _renderSeriesDetailArticleItem = ({ item, index }) => (
    <SeriesDetailArticleItem
      index={index + 1}
      article={item}
      seriesId={id}
      isActor={isActor}
    />
  );

  const _keyExtractor = (item) => `artc-series-detail-${item?.id}`;

  const renderLoading = () => <Header />;

  if (!isMounted || (isEmpty(series) && !isFetchError)) return renderLoading();

  if (isFetchError) {
    return <ContentUnavailable />;
  }
  return (
    <View style={styles.wrapper}>
      <Header
        rightIcon="menu"
        onRightPress={showMenu}
        icon={isActor ? 'Plus' : undefined}
        onPressIcon={onPressSearch}
      />
      <FlatList
        data={articles}
        keyExtractor={_keyExtractor}
        renderItem={_renderSeriesDetailArticleItem}
        ListHeaderComponent={_renderHeaderComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
      {isActor
        && (
        <AddArticles
          seriesId={id}
          audience={audience}
          articles={articles}
          isOpen={isOpenSearch}
          onClose={onCloseSearch}
          placeholder={t('article:search_article_placeholder')}
        />
        )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    container: {
      paddingBottom: spacing.padding.extraLarge,
    },
  });
};

export default SeriesDetail;
