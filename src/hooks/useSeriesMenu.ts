import i18next from 'i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import { Keyboard } from 'react-native';

import { IPost } from '~/interfaces/IPost';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import useCommonController from '~/screens/store';
import { getPostMenus } from '~/helpers/post';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { generateLink, LinkGeneratorTypes } from '~/utils/link';
import { Button } from '~/baseComponents';
import useModalStore from '~/store/modal';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

const useSeriesMenu = (
  data: IPost,
  isActor: boolean,
  isFromDetail: boolean,
  handleConfirmDelete: () => void,
) => {
  const { rootNavigation } = useRootNavigation();

  const commonActions = useCommonController((state) => state.actions);
  const {
    showToast, showAlert, hideBottomList, showBottomList,
  }
    = useModalStore((state) => state.actions);

  if (!data) return null;

  const {
    id: seriesId, reactionsCount, isSaved, type, audience,
  } = data;

  const groupAudience = audience?.groups || [];

  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );

  const audienceListCannotPinContent = getAudienceListWithNoPermission(
    groupAudience,
    [
      PermissionKey.FULL_PERMISSION,
      PermissionKey.PIN_CONTENT,
    ],
  );

  const onPressEdit = () => {
    hideBottomList();
    rootNavigation?.navigate?.(seriesStack.createSeries, {
      seriesId,
      isFromDetail,
    });
  };

  const onPressCopyLink = () => {
    hideBottomList();
    Clipboard.setString(generateLink(LinkGeneratorTypes.SERIRES, seriesId));
    showToast({ content: 'common:text_link_copied_to_clipboard' });
  };

  const onPressDelete = () => {
    hideBottomList();
    showAlert({
      title: i18next.t('series:menu_text_delete_series'),
      content: i18next.t('series:content_delete_series'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: handleConfirmDelete,
    });
  };

  const onPressSave = () => {
    hideBottomList();
    if (isSaved) {
      commonActions.unsavePost(seriesId, type);
    } else {
      commonActions.savePost(seriesId, type);
    }
  };

  const onPressPin = () => {
    hideBottomList();
    rootNavigation?.navigate?.(homeStack.pinContent, { postId: seriesId });
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
      title: i18next.t(
        `series:menu_text_${isSaved ? 'unsave' : 'save'}_series`,
      ),
      requireIsActor: false,
      onPress: onPressSave,
    },
    {
      id: 4,
      testID: 'series_menu.pin',
      leftIcon: 'Thumbtack',
      title: i18next.t('common:pin'),
      requireIsActor: false,
      shouldBeHidden:
        audienceListCannotPinContent.length === groupAudience.length,
      onPress: onPressPin,
    },
    {
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
    showBottomList({ data: menus } as BottomListProps);
  };

  return {
    showMenu,
  };
};

export default useSeriesMenu;
