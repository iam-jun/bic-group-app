import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';
import { ContentHeader } from '~/components/ContentView';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useMyPermissions } from '~/hooks/permissions';
import { IAudienceGroup, IPost } from '~/interfaces/IPost';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { AlertDeleteAudiences } from '~/components/posts';
import modalActions from '~/storeRedux/modal/actions';
import useSeriesStore, { ISeriesState } from '~/screens/series/store';
import useSeriesMenu from '~/hooks/useSeriesMenu';

type SeriesHeaderProps = {
  series: IPost;
  disabled?: boolean;
};

const SeriesHeader: FC<SeriesHeaderProps> = ({ series, disabled }) => {
  const { actor, audience, id } = series;
  const { rootNavigation } = useRootNavigation();
  const userId = useUserIdAuth();
  const { t } = useBaseHook();

  const dispatch = useDispatch();

  const actions = useSeriesStore((state: ISeriesState) => state.actions);

  const { hasPermissionsOnAtLeastOneScope, PERMISSION_KEY }
    = useMyPermissions();
  const canDeleteOwnPost = hasPermissionsOnAtLeastOneScope(
    audience?.groups,
    PERMISSION_KEY.GROUP.DELETE_OWN_POST,
  );

  const goToSeriesDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: id });
  };

  const onPressHeader = () => {
    goToSeriesDetail();
  };

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
            <AlertDeleteAudiences
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
            <AlertDeleteAudiences
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

  const { showMenu } = useSeriesMenu(series, actor?.id == userId, false, handleConfirmDelete);

  return (
    <ContentHeader
      actor={actor}
      disabled={disabled}
      audience={audience}
      onPressHeader={onPressHeader}
      onPressMenu={showMenu}
    />
  );
};

export default SeriesHeader;
