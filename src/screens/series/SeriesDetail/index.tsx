import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';
import Header from '~/beinComponents/Header';
import { BottomListProps } from '~/components/BottomList';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useMyPermissions } from '~/hooks/permissions';
import { IAudienceGroup } from '~/interfaces/IPost';
import AlertDeleteAudiencesConfirmContent from '~/components/posts/AlertDeleteAudiences';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import modalActions from '~/storeRedux/modal/actions';
import DeletedItem from '../../../components/series/DeletedItem';
import { getSeriesMenu } from '../../../helpers/series';
import SeriesDetailHeader from './components/SeriesDetailHeader';
import useSeriesStore, { ISeriesState } from '../store';

const SeriesDetail = ({ route }: any) => {
  const { params } = route || {};
  const { seriesId } = params || {};
  const theme = useTheme();
  const styles = createStyle(theme);
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const series = usePostsStore(useCallback(postsSelector.getPost(seriesId, {}), [seriesId]));

  const {
    actor, id, deleted, audience,
  } = series;
  const actions = useSeriesStore((state: ISeriesState) => state.actions);

  useEffect(() => {
    actions.getSeriesDetail(seriesId);
  }, []);

  const { hasPermissionsOnAtLeastOneScope, PERMISSION_KEY }
    = useMyPermissions();
  const canDeleteOwnPost = hasPermissionsOnAtLeastOneScope(
    'groups',
    audience?.groups,
    PERMISSION_KEY.GROUP.DELETE_OWN_POST,
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

  const onRightPress = () => {
    Keyboard.dismiss();
    const data = getSeriesMenu({
      reactionsCount: {},
      isActor: actor?.id == userId,
      dispatch,
      seriesId: id,
      navigaton: rootNavigation,
      isFromDetail: true,
      handleConfirmDelete,
    });

    dispatch(
      modalActions.showBottomList({ isOpen: true, data } as BottomListProps),
    );
  };

  if (deleted) {
    return (
      <View style={styles.container}>
        <Header />
        <DeletedItem />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        rightIcon="menu"
        onRightPress={onRightPress}
      />

      <SeriesDetailHeader series={series} />
      {/* for the next sprint */}
      {/* list SeriesDetailArticleItem */}
      {/* <SeriesDetailArticleItem
        index={1}
        article={article_from_series}
      /> */}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
  });
};

export default SeriesDetail;
