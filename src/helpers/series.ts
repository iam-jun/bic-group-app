import i18next from 'i18next';
import Clipboard from '@react-native-clipboard/clipboard';

import modalActions, { showHideToastMessage } from '~/storeRedux/modal/actions';
import { getLink, LINK_SERIRES } from '~/utils/link';
import { Button } from '~/baseComponents';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

interface Props {
  reactionsCount: any,
  isActor: boolean,
  dispatch:any,
  seriesId: string,
  navigaton: any,
  isFromDetail?: boolean,
  handleConfirmDelete: ()=> void,
}

export const getSeriesMenu = ({
  reactionsCount,
  isActor,
  dispatch,
  seriesId,
  navigaton,
  isFromDetail,
  handleConfirmDelete,
}: Props) => {
  const onPressEdit = () => {
    dispatch(modalActions.hideBottomList());
    navigaton?.navigate?.(
      seriesStack.createSeries, {
        seriesId,
        isFromDetail,
      },
    );
  };

  const onPressUpcomingFeature = () => {
    dispatch(modalActions.hideBottomList());
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getLink(
      LINK_SERIRES, seriesId,
    ));
    dispatch(showHideToastMessage({ content: 'common:text_link_copied_to_clipboard' }));
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideBottomList());
    dispatch(
      modalActions.showAlert({
        title: i18next.t('series:menu_text_delete_series'),
        content: i18next.t('series:content_delete_series'),
        cancelBtn: true,
        confirmLabel: i18next.t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        confirmBtnProps: { type: 'ghost' },
        onConfirm: handleConfirmDelete,
      }),
    );
  };

  const defaultData = [
    {
      id: 1,
      testID: 'series_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('series:menu_text_edit_series'),
      requireIsActor: true,
      onPress: onPressEdit,
    },
    {
      id: 2,
      testID: 'series_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:post_menu_copy'),
      requireIsActor: false,
      onPress: onPressCopyLink,
    },
    {
      id: 3,
      testID: 'series_menu.save',
      leftIcon: 'Bookmark',
      title: i18next.t('series:menu_text_save_series'),
      requireIsActor: false,
      upcoming: true,
      onPress: onPressUpcomingFeature,
    },
    {
      id: 4,
      testID: 'series_menu.insights',
      leftIcon: 'iconReact',
      title: i18next.t('post:post_menu_view_reactions'),
      requireIsActor: false,
      // requireReactionCounts: true,
      upcoming: true,
      onPress: onPressUpcomingFeature,
    }, {
      id: 5,
      testID: 'series_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('series:menu_text_delete_series'),
      requireIsActor: true,
      onPress: onPressDelete,
    },
  ];
  const result = [];
  defaultData.forEach((item: any) => {
    if ((!item.requireIsActor && !item?.requireReactionCounts) || (item.requireIsActor && isActor)
     || (item?.requireReactionCounts && !!reactionsCount && !!Object.keys(reactionsCount)?.[0])) {
      result.push({ ...item });
    }
  });

  return result;
};
