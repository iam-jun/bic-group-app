import { ExtendedTheme, useTheme, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { isEmpty } from 'lodash';
import { Button } from '~/baseComponents';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { useUserIdAuth } from '~/hooks/auth';
import { IAudienceGroup } from '~/interfaces/IPost';
import AlertDeleteAudiencesConfirmContent from '~/components/posts/AlertDeleteAudiences';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import DeletedItem from '../../../components/DeletedItem';
import SeriesDetailHeader from './components/SeriesDetailHeader';
import SeriesDetailItem from './components/SeriesDetailItem';
import useSeriesStore, { ISeriesState } from '../store';
import useSeriesMenu from '~/hooks/useSeriesMenu';
import { spacing } from '~/theme';
import AddArticles from './components/AddArticles';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import ContentUnavailable from '~/components/ContentUnavailable';
import useMounted from '~/hooks/mounted';
import useModalStore from '~/store/modal';

const SeriesDetail = ({ route }: any) => {
  const { params } = route || {};
  const { seriesId } = params || {};
  const theme = useTheme();
  const styles = createStyle(theme);
  const userId = useUserIdAuth();
  const { t } = useBaseHook();
  const isFocused = useIsFocused();
  const { rootNavigation } = useRootNavigation();

  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const { showAlert } = useModalStore((state) => state.actions);

  const series = usePostsStore(useCallback(postsSelector.getPost(seriesId, {}), [seriesId]));

  const {
    actor, id, deleted, audience, items = [],
  } = series;
  const { actions, errors } = useSeriesStore((state: ISeriesState) => state);
  const isFetchError = errors[seriesId];

  const isMounted = useMounted();

  const isActor = actor?.id == userId;

  useEffect(() => {
    if (isMounted) { actions.getSeriesDetail(seriesId); }
  }, [isMounted, seriesId]);

  useEffect(() => {
    if (deleted && isFocused) {
      setTimeout(() => {
        rootNavigation.goBack();
      }, 200);
    }
  }, [deleted, isFocused]);

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
      showAlert({
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
      });
    } else {
      showAlert({
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
      });
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

  const renderHeaderComponent = () => <SeriesDetailHeader series={series} />;

  const renderSeriesDetailItem = ({ item, index }) => (
    <SeriesDetailItem
      index={index + 1}
      item={item}
      seriesId={id}
      isActor={isActor}
    />
  );

  const keyExtractor = (item) => `artc-series-detail-${item?.id}`;

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
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderSeriesDetailItem}
        ListHeaderComponent={renderHeaderComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
      {isActor
        && (
        <AddArticles
          seriesId={id}
          audience={audience}
          articles={items}
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
