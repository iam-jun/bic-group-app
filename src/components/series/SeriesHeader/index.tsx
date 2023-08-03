/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react';
import { Button } from '~/baseComponents';
import { ContentHeader } from '~/components/ContentView';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { IAudienceGroup, IPost, PostType } from '~/interfaces/IPost';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { AlertDeleteAudiences } from '~/components/posts';
import useSeriesStore, { ISeriesState } from '~/screens/series/store';
import useSeriesMenu from '~/hooks/useSeriesMenu';
import { PermissionKey } from '~/constants/permissionScheme';
import useMyPermissionsStore from '~/store/permissions';
import useModalStore from '~/store/modal';
import { TrackingEventContentReadAction, TrackingEventContentReadProperties, TrackingEventType } from '~/interfaces/ITrackingEvent';
import { trackEvent } from '~/services/tracking';

type SeriesHeaderProps = {
  series: IPost;
  disabled?: boolean;
};

const SeriesHeader: FC<SeriesHeaderProps> = ({ series, disabled }) => {
  const { actor, audience, id } = series;
  const { rootNavigation } = useRootNavigation();
  const userId = useUserIdAuth();
  const { t } = useBaseHook();

  const { showAlert } = useModalStore((state) => state.actions);

  const actions = useSeriesStore((state: ISeriesState) => state.actions);

  const { shouldHavePermissionOnSomeAudience } = useMyPermissionsStore((state) => state.actions);
  const canDeleteOwnPost = shouldHavePermissionOnSomeAudience(
    audience?.groups,
    PermissionKey.CRUD_POST_ARTICLE,
  );

  const goToSeriesDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: id });
  };

  const onPressHeader = () => {
    goToSeriesDetail();

    // tracking event
    const eventContentReadProperties: TrackingEventContentReadProperties = {
      content_type: PostType.SERIES,
      action: TrackingEventContentReadAction.CONTENT_HEADER,
    };
    trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
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
      showAlert({
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
      });
    } else {
      showAlert({
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
      });
    }
  };

  const handleConfirmDelete = () => {
    actions.deleteSeries(
      id,
      // handleError
    );
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
