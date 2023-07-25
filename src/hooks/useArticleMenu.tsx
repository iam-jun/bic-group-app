import React from 'react';
import i18next from 'i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import { Keyboard } from 'react-native';

import { isEmpty } from 'lodash';
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
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import useQuizzesStore from '~/store/entities/quizzes';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import { QuizStatus } from '~/interfaces/IQuiz';

const useArticleMenu = (data: IPost, isActor: boolean) => {
  const { rootNavigation } = useRootNavigation();

  const commonActions = useCommonController((state) => state.actions);
  const modalActions = useModalStore((state) => state.actions);
  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);

  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );

  if (!data) return null;

  const {
    id: articleId, reactionsCount, isSaved, type, audience, actor, quiz,
  } = data;

  const groupAudience = audience?.groups || [];

  const audienceListCannotCRUDPostArticle = getAudienceListWithNoPermission(
    groupAudience,
    PermissionKey.CRUD_POST_ARTICLE,
  );

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

  const shouldBeHiddenCreateQuizOption
    = !!quiz || audienceListCannotCRUDPostArticle.length > 0;
  const shouldBeHiddenEditOrDeleteQuizOption
    = !quiz
    || quiz.status !== QuizStatus.PUBLISHED
    || audienceListCannotCRUDPostArticle.length > 0;

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

  const onPressEditSettings = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(articleStack.createArticleSettings, { articleId, isFromArticleMenuSettings: true });
  };

  const onPressViewReactions = () => {
    modalActions.hideBottomList();
    const firstReact = reactionsCount[0];
    if (!!firstReact && !isEmpty(firstReact)) {
      const initReaction = Object.keys(firstReact)[0];
      const payload: IPayloadReactionDetailBottomSheet = {
        reactionsCount,
        initReaction,
        getDataParam: { target: 'POST', targetId: articleId },
      };
      modalActions.showReactionDetailBottomSheet(payload);
    }
  };

  const onPressCUDQuiz = () => {
    modalActions.hideBottomList();
    rootNavigation?.navigate?.(quizStack.entryQuiz, { postId: articleId });
  };

  const onPressEditQuiz = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: i18next.t('quiz:alert_edit:header'),
      content: i18next.t('quiz:alert_edit:content'),
      cancelBtn: true,
      confirmLabel: i18next.t('quiz:continue'),
      onConfirm: () => {
        rootNavigation?.navigate(
          quizStack.composeQuiz, {
            quizId: quiz?.id,
          },
        );
      },
    });
  };

  const onPressDeleteQuiz = () => {
    modalActions.hideBottomList();
    modalActions.showAlert({
      title: i18next.t('quiz:alert_delete:header'),
      content: i18next.t('quiz:alert_delete:content'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: () => {
        actionsQuizzesStore.deleteQuiz(quiz?.id, articleId);
      },
    });
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
      testID: 'article_view_menu.edit_settings',
      leftIcon: 'Sliders',
      title: i18next.t('common:edit_settings'),
      requireIsActor: false,
      shouldBeHidden: audienceListCannotEditSettings.length > 0,
      onPress: onPressEditSettings,
    },
    {
      id: 3,
      testID: 'article_view_menu.save',
      leftIcon: isSaved ? 'BookmarkSlash' : 'Bookmark',
      title: i18next.t(`article:menu:${isSaved ? 'unsave' : 'save'}`),
      requireIsActor: false,
      onPress: onPressSave,
    },
    {
      id: 4,
      testID: 'article_view_menu.copy',
      leftIcon: 'LinkHorizontal',
      title: i18next.t('article:menu:copy_link'),
      requireIsActor: false,
      onPress: onPressCopyLink,
    },
    {
      id: 5,
      testID: 'article_view_menu.quiz',
      leftIcon: 'BallotCheck',
      title: i18next.t('quiz:create_quiz'),
      requireIsActor: true,
      shouldBeHidden: shouldBeHiddenCreateQuizOption,
      onPress: onPressCUDQuiz,
    },
    {
      id: 6,
      testID: 'article_view_menu.insights',
      leftIcon: 'iconReact',
      title: i18next.t('post:post_menu_view_reactions'),
      requireIsActor: false,
      requireReactionCounts: true,
      onPress: onPressViewReactions,
    },
    {
      id: 7,
      testID: 'post_view_menu.view_series',
      leftIcon: 'RectangleHistory',
      title: i18next.t('common:btn_view_series'),
      requireIsActor: false,
      onPress: onPressViewSeries,
    },
    {
      id: 8,
      testID: 'article_view_menu.pin',
      leftIcon: 'Thumbtack',
      title: i18next.t('common:pin_unpin'),
      requireIsActor: false,
      shouldBeHidden:
        audienceListCannotPinContent.length === groupAudience.length,
      onPress: onPressPin,
    },
    {
      id: 9,
      testID: 'article_view_menu.report',
      leftIcon: 'Flag',
      title: i18next.t('common:btn_report_content'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: onPressReport,
    },
    {
      id: 10,
      testID: 'article_view_menu.report_this_member',
      leftIcon: 'UserXmark',
      title: i18next.t('groups:member_menu:label_report_member'),
      requireIsActor: false,
      notShowForActor: isActor,
      onPress: _onPressReportThisMember,
    },
    {
      id: 11,
      testID: 'article_view_menu.edit_quiz',
      leftIcon: 'FilePen',
      title: i18next.t('quiz:edit_quiz'),
      requireIsActor: true,
      shouldBeHidden: shouldBeHiddenEditOrDeleteQuizOption,
      onPress: onPressEditQuiz,
      isShowBorderTop: true,
    },
    {
      id: 12,
      testID: 'article_view_menu.delete_quiz',
      leftIcon: 'TrashCan',
      title: i18next.t('quiz:delete_quiz'),
      requireIsActor: true,
      shouldBeHidden: shouldBeHiddenEditOrDeleteQuizOption,
      onPress: onPressDeleteQuiz,
      isShowBorderBottom: true,
    },
    {
      id: 13,
      testID: 'article_view_menu.delete',
      leftIcon: 'TrashCan',
      title: i18next.t('article:menu:delete'),
      requireIsActor: true,
      onPress: onDelete,
      isDanger: true,
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
