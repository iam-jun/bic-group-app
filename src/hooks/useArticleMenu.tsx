import React from 'react';
import i18next from 'i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import { Keyboard } from 'react-native';

import useArticleController from '~/screens/articles/store';
import { IPost } from '~/interfaces/IPost';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import ReportContent from '~/components/Report/ReportContent';
import SeriesContentModal from '~/components/series/SeriesContentModal';
import useCommonController from '~/screens/store';
import { getPostMenus, getRootGroupids } from '~/helpers/post';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { TargetType, ReportTo } from '~/interfaces/IReport';
import { generateLink, LinkGeneratorTypes } from '~/utils/link';
import useModalStore from '~/store/modal';
import { Button } from '~/baseComponents';
import { onPressReportThisMember } from '~/helpers/blocking';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

const useArticleMenu = (data: IPost, isActor: boolean) => {
  const { rootNavigation } = useRootNavigation();

  const commonActions = useCommonController((state) => state.actions);
  const modalActions = useModalStore((state) => state.actions);

  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );

  if (!data) return null;

  const {
    id: articleId, reactionsCount, isSaved, type, audience, actor,
  } = data;

  const groupAudience = audience?.groups || [];

  const audienceListCannotPinContent = getAudienceListWithNoPermission(
    groupAudience,
    [
      PermissionKey.FULL_PERMISSION,
      PermissionKey.PIN_CONTENT,
    ],
  );

  const onPressEdit = () => {
    modalActions.hideBottomList();
    rootNavigation.navigate(articleStack.createArticle, { articleId });
  };

  const onPressSave = () => {
    modalActions.hideBottomList();
    if (isSaved) {
      commonActions.unsavePost(articleId, type);
    } else {
      commonActions.savePost(articleId, type);
    }
  };

  const onPressReport = () => {
    const rootGroupIds = getRootGroupids(audience);

    modalActions.hideBottomList();

    // in this sprint default reportTo is COMMUNITY
    modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <ReportContent
          targetId={articleId}
          targetType={TargetType.ARTICLE}
          groupIds={rootGroupIds}
          reportTo={ReportTo.COMMUNITY}
        />
      ),
    });
  };

  const onPressViewSeries = () => {
    modalActions.hideBottomList();

    modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: i18next.t('common:btn_view_series'),
      ContentComponent: <SeriesContentModal id={articleId} />,
    });
  };

  const onDelete = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: i18next.t('article:menu:delete'),
      content: i18next.t('post:content_delete_article'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: () => useArticleController
        .getState()
        .actions.deleteArticle(
          articleId,
        ),
    });
  };

  const onPressCopyLink = () => {
    modalActions.hideBottomList();
    Clipboard.setString(generateLink(LinkGeneratorTypes.ARTICLE, articleId));
    modalActions.showToast({ content: 'common:text_link_copied_to_clipboard' });
  };

  const _onPressReportThisMember = () => {
    onPressReportThisMember({ modalActions, actor });
  };

  const onPressPin = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(homeStack.pinContent, { postId: articleId });
  };

  const defaultData = [
    {
      id: 1,
      testID: 'article_view_menu.edit',
      leftIcon: 'FilePen',
      title: i18next.t('article:menu:edit'),
      requireIsActor: true,
      onPress: onPressEdit,
    },
    {
      id: 2,
      testID: 'article_view_menu.save',
      leftIcon: isSaved ? 'BookmarkSlash' : 'Bookmark',
      title: i18next.t(`article:menu:${isSaved ? 'unsave' : 'save'}`),
      requireIsActor: false,
      onPress: onPressSave,
    },
    {
      id: 3,
      testID: 'article_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('article:menu:copy_link'),
      requireIsActor: false,
      onPress: onPressCopyLink,
    },
    {
      id: 4,
      testID: 'post_view_menu.view_series',
      leftIcon: 'RectangleHistory',
      title: i18next.t('common:btn_view_series'),
      requireIsActor: false,
      onPress: onPressViewSeries,
    },
    {
      id: 5,
      testID: 'article_view_menu.pin',
      leftIcon: 'Thumbtack',
      title: i18next.t('common:pin_unpin'),
      requireIsActor: false,
      shouldBeHidden:
        audienceListCannotPinContent.length === groupAudience.length,
      onPress: onPressPin,
    },
    {
      id: 6,
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('article:menu:delete'),
      requireIsActor: true,
      onPress: onDelete,
    },
    {
      id: 7,
      testID: 'article_view_menu.report',
      leftIcon: 'Flag',
      title: i18next.t('common:btn_report_content'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: onPressReport,
    },
    {
      id: 7,
      testID: 'article_view_menu.report_this_member',
      leftIcon: 'UserXmark',
      title: i18next.t('groups:member_menu:label_report_member'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: _onPressReportThisMember,
    },
  ];

  const menus = getPostMenus(defaultData, isActor, reactionsCount);

  const showMenu = () => {
    Keyboard.dismiss();
    modalActions.showBottomList({ data: menus } as BottomListProps);
  };

  return {
    showMenu,
  };
};

export default useArticleMenu;
