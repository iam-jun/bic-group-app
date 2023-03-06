import React from 'react';
import i18next from 'i18next';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import useSeriesDetailItemStore, { ISeriesDetailItemState } from './store';
import useModalStore from '~/store/modal';
import { PostType } from '~/interfaces/IPost';
import SeriesContentModal from '~/components/series/SeriesContentModal';

const useSeriesDetailItemMenu = (
  seriesId: string, itemId: string, type: string,
) => {
  const { rootNavigation } = useRootNavigation();
  const {
    showAlert, hideBottomList, showBottomList, showModal,
  } = useModalStore((state) => state.actions);

  const actions = useSeriesDetailItemStore((state: ISeriesDetailItemState) => state.actions);
  const typeRemove = type === PostType.ARTICLE ? 'article' : 'post';

  const onPress = () => {
    hideBottomList();
    showAlert({
      title: i18next.t(`post:series_detail_item_menu:delete_${typeRemove}`),
      content: i18next.t(`series:text_remove_${typeRemove}`),
      cancelBtn: true,
      confirmLabel: i18next.t('common:text_remove'),
      ConfirmBtnComponent: Button.Danger,
      onConfirm: () => {
        actions.deleteItemFromSeriesDetail(seriesId, itemId);
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
      ContentComponent: <SeriesContentModal id={itemId} />,
    });
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
  ];

  const showMenu = () => {
    showBottomList({ isOpen: true, data: defaultData } as any);
  };

  return {
    showMenu,
  };
};

export default useSeriesDetailItemMenu;
