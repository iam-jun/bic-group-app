import React from 'react';
import i18next from 'i18next';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import useSeriesDetailItemStore, { ISeriesDetailItemState } from './store';
import useModalStore from '~/store/modal';
import { IPost, PostType } from '~/interfaces/IPost';
import SeriesContentModal from '~/components/series/SeriesContentModal';
import getAudienceListWithNoPermission from '~/store/permissions/actions/getAudienceListWithNoPermission';
import { PermissionKey } from '~/constants/permissionScheme';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

const useSeriesDetailItemMenu = (
  seriesId: string, item: IPost,
) => {
  const { id, type, audience } = item;
  const { rootNavigation } = useRootNavigation();
  const {
    showAlert, hideBottomList, showBottomList, showModal,
  } = useModalStore((state) => state.actions);

  const actions = useSeriesDetailItemStore((state: ISeriesDetailItemState) => state.actions);
  const typeRemove = type === PostType.ARTICLE ? 'article' : 'post';

  const groupAudience = audience?.groups || [];
  const audienceListCannotPinContent = getAudienceListWithNoPermission(
    groupAudience,
    [
      PermissionKey.FULL_PERMISSION,
      PermissionKey.PIN_CONTENT,
    ],
  );

  const onPress = () => {
    hideBottomList();
    showAlert({
      title: i18next.t(`post:series_detail_item_menu:delete_${typeRemove}`),
      content: i18next.t(`series:text_remove_${typeRemove}`),
      cancelBtn: true,
      confirmLabel: i18next.t('common:text_remove'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        actions.deleteItemFromSeriesDetail(seriesId, id);
      },
      confirmBtnProps: { type: 'ghost' },
    });
  };

  const onPressReorder = () => {
    hideBottomList();
    rootNavigation.navigate(seriesStack.reorderItems, { seriesId });
  };

  const onPressViewSeries = () => {
    hideBottomList();

    showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: i18next.t('common:btn_view_series'),
      ContentComponent: <SeriesContentModal id={id} />,
    });
  };

  const onPressPin = () => {
    hideBottomList();
    rootNavigation?.navigate?.(homeStack.pinContent, { postId: id });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'series_detail_item_menu.reoder',
      title: i18next.t('post:series_detail_item_menu:reorder'),
      onPress: onPressReorder,
    },
    {
      id: 2,
      testID: 'series_detail_item_menu.delete',
      title: i18next.t(`post:series_detail_item_menu:delete_${typeRemove}`),
      onPress,
    },
    {
      id: 3,
      testID: 'series_detail_item_menu.view_series',
      title: i18next.t('post:series_detail_item_menu:view_series'),
      onPress: onPressViewSeries,
    },
    {
      id: 4,
      testID: 'series_detail_item_menu.pin',
      title: i18next.t('common:pin_unpin'),
      shouldBeHidden:
        audienceListCannotPinContent.length === groupAudience.length,
      onPress: onPressPin,
    },
  ];

  const showMenu = () => {
    showBottomList({ isOpen: true, data: defaultData } as any);
  };

  return {
    showMenu,
  };
};

export default useSeriesDetailItemMenu;
