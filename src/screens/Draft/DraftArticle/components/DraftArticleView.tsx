import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import {
  IPayloadGetDraftPosts,
  IPost,
} from '~/interfaces/IPost';
import { scaleCoverHeight } from '~/theme/dimension';
import Divider from '~/beinComponents/Divider';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import DraftFooter from '../../components/DraftFooter';
import { ContentHeader } from '~/components/ContentView';
import { IPayloadPublishDraftArticle } from '~/interfaces/IArticle';
import { useUserIdAuth } from '~/hooks/auth';
import useDraftArticleStore from '../store';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import { Button } from '~/baseComponents';
import useArticleController from '~/screens/articles/store';
import { ArticleSummary, ArticleTitle } from '~/components/articles';

interface DraftViewProps {
  data: IPost;
}

const DraftArticleView = ({ data }: DraftViewProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const userId = useUserIdAuth();
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const actions = useDraftArticleStore((state) => state.actions);
  const articleActions = useArticleController((state) => state.actions);

  const {
    id,
    actor,
    audience,
    createdAt,
    coverMedia,
    title,
    summary,
    content,
    categories,
    isProcessing,
  } = data || {};

  const shouldDisableButtonPublish = isPublishing
    || !title
    || !content
    || audience?.groups?.length === 0
    || categories?.length === 0;

  const onDelete = () => {
    articleActions.deleteArticle({ id, isDraft: true });
  };

  const onPressDelete = () => {
    dispatch(modalActions.showAlert({
      title: t('post:title_delete_article'),
      content: t('post:content_delete_article'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: onDelete,
    }));
  };

  const refreshDraftArticles = () => {
    if (userId) {
      const payload: IPayloadGetDraftPosts = { isRefresh: true };
      actions.getDraftArticles(payload);
    }
  };

  const onPressPublish = () => {
    if (!id) return;

    setIsPublishing(true);
    const payload: IPayloadPublishDraftArticle = {
      draftArticleId: id,
      onSuccess: () => {
        dispatch(modalActions.showHideToastMessage({ content: 'post:draft:text_draft_article_published' }));
        refreshDraftArticles();
      },
      onError: () => setIsPublishing(false),
    };

    actions.publishDraftArticle(payload);
  };

  const onPressEdit = () => {
    rootNavigation?.navigate(articleStack.editArticleTitle, { articleId: id, isDraft: true });
  };

  // use base ContentHeader to prevent user press event
  const renderHeader = () => (
    <ContentHeader
      actor={actor}
      createdAt={createdAt}
      audience={audience}
    />
  );

  const renderImageThumbnail = () => (
    <Image
      style={styles.cover}
      source={coverMedia?.url}
      placeholderSource={images.img_thumbnail_default}
    />
  );

  const renderPreviewSummary = () => (
    <View style={styles.contentContainer}>
      <ArticleTitle text={title} />
      {!!summary && (
        <>
          <ViewSpacing height={spacing.margin.small} />
          <ArticleSummary text={summary} />
        </>
      )}
    </View>
  );

  const renderFooter = () => (
    <>
      <View style={styles.divider}>
        <Divider color={colors.neutral5} />
      </View>
      <DraftFooter
        isProcessing={isProcessing}
        isPublishing={isPublishing}
        shouldDisableButtonPublish={shouldDisableButtonPublish}
        onPressDelete={onPressDelete}
        onPressEdit={onPressEdit}
        onPressPublish={onPressPublish}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderImageThumbnail()}
      {renderPreviewSummary()}
      {renderFooter()}
      <ViewSpacing height={8} />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      ...elevations.e2,
    },
    cover: {
      width: '100%',
      height: scaleCoverHeight(),
      marginTop: spacing.margin.base,
    },
    contentContainer: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.purple2,
    },
    divider: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default DraftArticleView;
