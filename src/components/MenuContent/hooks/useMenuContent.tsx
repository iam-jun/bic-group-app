/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import i18next from 'i18next';
import { isEmpty } from 'lodash';
import Clipboard from '@react-native-clipboard/clipboard';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { generateLink } from '~/utils/link';
import { IPost, PostType } from '~/interfaces/IPost';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import { Button } from '~/baseComponents';
import { useRootNavigation } from '../../../hooks/navigation';
import ReportContent from '~/components/Report/ReportContent';
import SeriesContentModal from '~/components/series/SeriesContentModal';
import useCommonController from '~/screens/store';
import { getRootGroupids } from '~/helpers/post';
import { ReportTo } from '~/interfaces/IReport';
import useModalStore from '~/store/modal';
import usePostsStore, { IPostsState } from '~/store/entities/posts';
import { onPressReportThisMember } from '~/helpers/blocking';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import useQuizzesStore from '~/store/entities/quizzes';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { getCopyLinkType, getReportContentType } from '../helper';
import useArticleController from '~/screens/articles/store';
import useNotificationItemMenu from '~/screens/Notification/components/NotificationMenu/store';
import { SpecificNotificationType } from '~/interfaces/INotification';

const useMenuContent = (
  data: IPost,
  contentType: PostType,
  isFromDetail: boolean,

  handleConfirmDeleteSeries?: () => void,
  handleDeletePostError?: (listAudiences: string[]) => void,
) => {
  const { rootNavigation } = useRootNavigation();

  const commonActions = useCommonController((state) => state.actions);
  const modalActions = useModalStore((state) => state.actions);
  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);
  const articleControllerActions = useArticleController((state) => state.actions);
  const { deletePost } = usePostsStore((state: IPostsState) => state.actions);
  const specifictNotiActions = useNotificationItemMenu((state) => state.actions);

  const copyLinkType = getCopyLinkType(contentType);
  const reportContentType = getReportContentType(contentType);

  if (!data) return null;

  const {
    id: contentId,
    reactionsCount,
    audience,
    actor,
    quiz,
  } = data;

  const onPressEdit = () => {
    modalActions.hideModal();
    if (contentType === PostType.POST) {
      rootNavigation?.navigate?.(homeStack.createPost, {
        postId: contentId,
        replaceWithDetail: !isFromDetail,
      });
    }

    if (contentType === PostType.ARTICLE) {
      rootNavigation.navigate(articleStack.createArticle, { articleId: contentId });
    }

    if (contentType === PostType.SERIES) {
      rootNavigation?.navigate?.(
        seriesStack.createSeries, {
          seriesId: contentId,
          isFromDetail,
        },
      );
    }
  };

  const onPressEditSettings = () => {
    modalActions.hideModal();
    if (contentType === PostType.POST) {
      rootNavigation?.navigate?.(homeStack.postSettings, {
        postId: contentId,
        isFromPostMenuSettings: true,
      });
    }

    if (contentType === PostType.ARTICLE) {
      rootNavigation?.navigate?.(articleStack.createArticleSettings, {
        articleId: contentId,
        isFromArticleMenuSettings: true,
      });
    }

    if (contentType === PostType.SERIES) {
      rootNavigation?.navigate?.(seriesStack.seriesSettings, {
        seriesId: contentId,
        isFromSeriesMenuSettings: true,
      });
    }
  };

  const onPressSave = (isSaved: boolean) => {
    modalActions.hideModal();
    if (isSaved) {
      commonActions.unsavePost(contentId, contentType);
    } else {
      commonActions.savePost(contentId, contentType);
    }
  };

  const onPressCopyLink = () => {
    modalActions.hideModal();
    Clipboard.setString(generateLink(copyLinkType, contentId));
    modalActions.showToast({ content: 'common:text_link_copied_to_clipboard' });
  };

  const onPressViewReactions = () => {
    modalActions.hideModal();
    const firstReact = reactionsCount[0];
    if (!!firstReact && !isEmpty(firstReact)) {
      const initReaction = Object.keys(firstReact)[0];
      const payload: IPayloadReactionDetailBottomSheet = {
        reactionsCount,
        initReaction,
        getDataParam: { target: 'POST', targetId: contentId },
      };
      modalActions.showReactionDetailBottomSheet(payload);
    }
  };

  const onPressViewSeries = () => {
    modalActions.hideModal();

    modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: i18next.t('common:btn_view_series'),
      ContentComponent: <SeriesContentModal id={contentId} />,
    });
  };

  const onPressPin = () => {
    modalActions.hideModal();
    rootNavigation?.navigate?.(homeStack.pinContent, { postId: contentId });
  };

  const onPressReport = () => {
    const rootGroupIds = getRootGroupids(audience);

    modalActions.hideModal();

    // in this sprint default reportTo is COMMUNITY
    modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <ReportContent
          targetId={contentId}
          targetType={reportContentType}
          groupIds={rootGroupIds}
          reportTo={ReportTo.COMMUNITY}
        />
      ),
    });
  };

  const _onPressReportThisMember = () => {
    onPressReportThisMember({ modalActions, actor });
  };

  const onPressCUDQuiz = () => {
    modalActions.hideModal();
    rootNavigation?.navigate?.(quizStack.entryQuiz, { postId: contentId });
  };

  const onConfirmEditQuiz = () => {
    const onSuccess = () => {
      rootNavigation?.navigate(
        quizStack.composeQuiz, {
          quizId: quiz?.id,
        },
      );
    };
    actionsQuizzesStore.getQuizDetail({ quizId: quiz?.id, onSuccess });
  };

  const onPressEditQuiz = () => {
    modalActions.hideModal();

    modalActions.showAlert({
      title: i18next.t('quiz:alert_edit:header'),
      content: i18next.t('quiz:alert_edit:content'),
      cancelBtn: true,
      confirmLabel: i18next.t('quiz:continue'),
      onConfirm: onConfirmEditQuiz,
    });
  };

  const onPressDeleteQuiz = () => {
    modalActions.hideModal();

    modalActions.showAlert({
      title: i18next.t('quiz:alert_delete:header'),
      content: i18next.t('quiz:alert_delete:content'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: () => {
        actionsQuizzesStore.deleteQuiz(quiz?.id, contentId);
      },
    });
  };

  const onPressDeleteContent = () => {
    modalActions.hideModal();

    if (contentType === PostType.POST) {
      modalActions.showAlert({
        title: i18next.t('post:title_delete_post'),
        content: i18next.t('post:content_delete_post'),
        cancelBtn: true,
        confirmLabel: i18next.t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        confirmBtnProps: { type: 'ghost' },
        onConfirm: () => deletePost({
          id: contentId,
          // callbackError: handleDeletePostError,
        }),
      });
    }

    if (contentType === PostType.ARTICLE) {
      modalActions.showAlert({
        title: i18next.t('article:menu:delete'),
        content: i18next.t('post:content_delete_article'),
        cancelBtn: true,
        confirmLabel: i18next.t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        confirmBtnProps: { type: 'ghost' },
        onConfirm: () => articleControllerActions.deleteArticle(
          contentId,
        ),
      });
    }

    if (contentType === PostType.SERIES) {
      modalActions.showAlert({
        title: i18next.t('series:menu_text_delete_series'),
        content: i18next.t('series:content_delete_series'),
        cancelBtn: true,
        confirmLabel: i18next.t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        confirmBtnProps: { type: 'ghost' },
        onConfirm: handleConfirmDeleteSeries,
      });
    }
  };

  const onPressNotificationSettingContent = (
    isEnable: boolean,
    contentTargetType: SpecificNotificationType,
  ) => {
    modalActions.hideModal();

    specifictNotiActions.editNotificationSettings(contentId, !isEnable, contentTargetType);
  };

  return {
    onPressEdit,
    onPressEditSettings,
    onPressSave,
    onPressCopyLink,
    onPressViewReactions,
    onPressViewSeries,
    onPressPin,
    onPressReport,
    _onPressReportThisMember,
    onPressCUDQuiz,
    onPressEditQuiz,
    onPressDeleteQuiz,
    onPressDeleteContent,
    onPressNotificationSettingContent,
  };
};

export default useMenuContent;
