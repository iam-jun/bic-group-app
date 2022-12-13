import i18next from 'i18next';
import Clipboard from '@react-native-clipboard/clipboard';

import { useDispatch } from 'react-redux';
import { Keyboard } from 'react-native';
import modalActions from '~/storeRedux/modal/actions';
import { IPost } from '~/interfaces/IPost';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import useCommonController from '~/screens/store';
import { getPostMenus } from '~/helpers/post';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { getLink, LINK_SERIRES } from '~/utils/link';
import { Button } from '~/baseComponents';

const useSeriesMenu = (
  data: IPost,
  isActor: boolean,
  isFromDetail: boolean,
  handleConfirmDelete: ()=> void,
) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();

  const commonActions = useCommonController((state) => state.actions);

  if (!data) return null;

  const {
    id: seriesId, reactionsCount, isSaved, type,
  } = data;

  const onPressEdit = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation?.navigate?.(
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
    dispatch(modalActions.showHideToastMessage({ content: 'common:text_link_copied_to_clipboard' }));
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

  const onPressSave = () => {
    dispatch(modalActions.hideBottomList());
    if (isSaved) {
      commonActions.unsavePost(seriesId, type);
    } else {
      commonActions.savePost(seriesId, type);
    }
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
      leftIcon: isSaved ? 'BookmarkSlash' : 'Bookmark',
      title: i18next.t(`series:menu_text_${isSaved ? 'unsave' : 'save'}_series`),
      requireIsActor: false,
      onPress: onPressSave,
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

  const menus = getPostMenus(defaultData, isActor, reactionsCount);

  const showMenu = () => {
    Keyboard.dismiss();
    dispatch(
      modalActions.showBottomList({ isOpen: true, data: menus } as BottomListProps),
    );
  };

  return {
    showMenu,
  };
};

export default useSeriesMenu;
