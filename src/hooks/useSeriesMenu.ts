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
import { onPressReportThisMember } from '~/helpers/blocking';
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
  const modalActions = useModalStore((state) => state.actions);

  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );

  if (!data) return null;

  const {
    id: seriesId, isSaved, type, actor, audience,
  } = data;

  const groupAudience = audience?.groups || [];

  const audienceListCannotEditSettings = getAudienceListWithNoPermission(
    groupAudience,
    PermissionKey.EDIT_OWN_CONTENT_SETTING,
  );

  const audienceListCannotPinContent = getAudienceListWithNoPermission(
    groupAudience,
    [
      PermissionKey.FULL_PERMISSION,
      PermissionKey.PIN_CONTENT,
    ],
  );

  const onPressEdit = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(
      seriesStack.createSeries, {
        seriesId,
        isFromDetail,
      },
    );
  };

  const onPressCopyLink = () => {
    modalActions.hideBottomList();
    Clipboard.setString(generateLink(
      LinkGeneratorTypes.SERIRES, seriesId,
    ));
    modalActions.showToast({ content: 'common:text_link_copied_to_clipboard' });
  };

  const onPressDelete = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
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
    modalActions.hideBottomList();
    if (isSaved) {
      commonActions.unsavePost(seriesId, type);
    } else {
      commonActions.savePost(seriesId, type);
    }
  };

  const _onPressReportThisMember = () => {
    onPressReportThisMember({ modalActions, actor });
  };

  const onPressPin = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(homeStack.pinContent, { postId: seriesId });
  };

  const onPressEditSettings = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(seriesStack.seriesSettings, { seriesId, isFromSeriesMenuSettings: true });
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
      testID: 'series_menu.edit_settings',
      leftIcon: 'Sliders',
      title: i18next.t('common:edit_settings'),
      requireIsActor: false,
      shouldBeHidden: audienceListCannotEditSettings.length > 0,
      onPress: onPressEditSettings,
    },
    {
      id: 3,
      testID: 'series_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('post:post_menu_copy'),
      requireIsActor: false,
      onPress: onPressCopyLink,
    },
    {
      id: 4,
      testID: 'series_menu.save',
      leftIcon: isSaved ? 'BookmarkSlash' : 'Bookmark',
      title: i18next.t(
        `series:menu_text_${isSaved ? 'unsave' : 'save'}_series`,
      ),
      requireIsActor: false,
      onPress: onPressSave,
    },
    {
      id: 5,
      testID: 'series_menu.pin',
      leftIcon: 'Thumbtack',
      title: i18next.t('common:pin_unpin'),
      requireIsActor: false,
      shouldBeHidden:
        audienceListCannotPinContent.length === groupAudience.length,
      onPress: onPressPin,
    },
    {
      id: 6,
      testID: 'series_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('series:menu_text_delete_series'),
      requireIsActor: true,
      onPress: onPressDelete,
    },
    {
      id: 7,
      testID: 'series_menu.report_this_member',
      leftIcon: 'UserXmark',
      title: i18next.t('groups:member_menu:label_report_member'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: _onPressReportThisMember,
    },
  ];

  const menus = getPostMenus(defaultData, isActor);

  const showMenu = () => {
    Keyboard.dismiss();
    modalActions.showBottomList({ data: menus } as BottomListProps);
  };

  return {
    showMenu,
  };
};

export default useSeriesMenu;
