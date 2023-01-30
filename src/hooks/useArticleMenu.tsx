import React from 'react';
import i18next from 'i18next';
import Clipboard from '@react-native-clipboard/clipboard';

import { useDispatch } from 'react-redux';
import { Keyboard } from 'react-native';
import useArticleController from '~/screens/articles/store';
import modalActions from '~/storeRedux/modal/actions';
import { IPost } from '~/interfaces/IPost';
import { useRootNavigation } from './navigation';
import { BottomListProps } from '~/components/BottomList';
import ReportContent from '~/components/Report/ReportContent';
import useCommonController from '~/screens/store';
import { getPostMenus, getRootGroupids } from '~/helpers/post';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { TargetType, ReportTo } from '~/interfaces/IReport';
import { getLink, LINK_ARTICLE } from '~/utils/link';
import useModalStore from '~/store/modal';
import { Button } from '~/baseComponents';

const useArticleMenu = (
  data: IPost,
  isActor: boolean,
) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();

  const commonActions = useCommonController((state) => state.actions);
  const { showToast, showAlert } = useModalStore((state) => state.actions);

  if (!data) return null;

  const {
    id: articleId, reactionsCount, isSaved, type, audience,
  } = data;

  const onPressEdit = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(articleStack.createArticle, { articleId });
  };

  const onPressSave = () => {
    dispatch(modalActions.hideBottomList());
    if (isSaved) {
      commonActions.unsavePost(articleId, type);
    } else {
      commonActions.savePost(articleId, type);
    }
  };

  const onPressReport = () => {
    const rootGroupIds = getRootGroupids(audience);

    dispatch(modalActions.hideBottomList());

    // in this sprint default reportTo is COMMUNITY
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: <ReportContent
        targetId={articleId}
        targetType={TargetType.ARTICLE}
        groupIds={rootGroupIds}
        reportTo={ReportTo.COMMUNITY}
      />,
    }));
  };

  const onDelete = () => {
    dispatch(modalActions.hideBottomList());
    showAlert({
      title: i18next.t('article:menu:delete'),
      content: i18next.t('post:content_delete_article'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: () => useArticleController.getState().actions.deleteArticle(
        articleId,
      ),
    });
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideBottomList());
    Clipboard.setString(getLink(
      LINK_ARTICLE, articleId,
    ));
    showToast({ content: 'common:text_link_copied_to_clipboard' });
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
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('article:menu:delete'),
      requireIsActor: true,
      onPress: onDelete,
    },
    {
      id: 5,
      testID: 'article_view_menu.report',
      leftIcon: 'Flag',
      title: i18next.t('common:btn_report_content'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: onPressReport,
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

export default useArticleMenu;
