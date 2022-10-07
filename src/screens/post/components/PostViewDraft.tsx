import React, { FC, useState } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { useBaseHook } from '~/hooks';
import streamApi from '~/api/StreamApi';
import postActions from '~/storeRedux/post/actions';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';

import {
  IPayloadGetDraftPosts,
  IPayloadPublishDraftPost,
  IPostActivity,
} from '~/interfaces/IPost';
import PostViewHeader from '~/screens/post/components/PostViewComponents/PostViewHeader';
import PostViewContent from '~/screens/post/components/PostViewComponents/PostViewContent';
import PostViewImportant from '~/screens/post/components/PostViewComponents/PostViewImportant';
import modalActions, { showHideToastMessage } from '~/storeRedux/modal/actions';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import useDraftPostStore from '../DraftPost/store';
import { Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Divider from '~/beinComponents/Divider';

export interface PostViewDraftProps {
  style?: StyleProp<ViewStyle>;
  data: IPostActivity;
  isPostDetail?: boolean;
}

const PostViewDraft: FC<PostViewDraftProps> = ({
  style,
  data,
  isPostDetail = false,
}: PostViewDraftProps) => {
  const [publishing, setPublishing] = useState(false);

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const { doGetDraftPosts } = useDraftPostStore();

  const {
    id,
    actor,
    audience,
    media,
    content,
    setting,
    isDraft,
    isProcessing,
    createdAt,
    linkPreview,
    mentions,
  } = data || {};

  const { images, videos, files } = media || {};
  const { isImportant, importantExpiredAt } = setting || {};

  const disableButtonPost = publishing
    || !content
    || (audience?.groups?.length === 0 && audience?.users?.length === 0);

  const showError = (e: any) => {
    dispatch(showHideToastMessage({
      content:
          e?.meta?.message
          || e?.meta?.errors?.[0]?.message
          || 'common:text_error_message',
      props: { type: 'error' },
    }));
  };

  const refreshDraftPosts = () => {
    if (userId) {
      const payload: IPayloadGetDraftPosts = { isRefresh: true };
      doGetDraftPosts(payload);
    }
  };

  const onPressPublish = () => {
    if (id) {
      setPublishing(true);
      const payload: IPayloadPublishDraftPost = {
        draftPostId: id,
        onSuccess: () => {
          dispatch(showHideToastMessage({ content: 'post:draft:text_draft_published' }));
          refreshDraftPosts();
        },
        onError: () => setPublishing(false),
      };
      dispatch(postActions.postPublishDraftPost(payload));
    }
  };

  const onPressEdit = () => {
    rootNavigation.navigate(
      homeStack.createPost, {
        draftPostId: id,
        replaceWithDetail: !isPostDetail,
      },
    );
  };

  const onDelete = () => {
    dispatch(modalActions.hideModal());
    if (id) {
      streamApi
        .deletePost(
          id, isDraft,
        )
        .then((response) => {
          if (response?.data) {
            dispatch(showHideToastMessage({ content: 'post:draft:text_draft_deleted' }));
            refreshDraftPosts();
          }
        })
        .catch((e) => {
          showError(e);
        });
    }
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlert({
      title: t('post:title_delete_post'),
      content: t('post:content_delete_post'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: onDelete,
    }));
  };

  const renderFooter = () => {
    if (isProcessing) {
      return (
        <Text.BodyS color={colors.gray50} style={styles.draftText}>
          {t('post:draft:text_processing_publish')}
        </Text.BodyS>
      );
    }
    return (
      <View style={[styles.row, styles.footerButtonContainer]}>
        <View style={styles.row}>
          <Button.Danger
            type="ghost"
            icon="TrashCan"
            onPress={onPressDelete}
          />
          <ViewSpacing width={16} />
          <Button.Secondary type="ghost" icon="PenToSquare" onPress={onPressEdit} />
        </View>
        <Button.Primary
          useI18n
          size="medium"
          loading={publishing}
          disabled={disableButtonPost}
          onPress={onPressPublish}
        >
          common:btn_publish
        </Button.Primary>
      </View>
    );
  };

  return (
    <View>
      <PostViewImportant
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
        markedReadPost={false}
      />
      <View style={[styles.container, style]}>
        <PostViewHeader
          audience={audience}
          actor={actor}
          time={createdAt}
        />
        <PostViewContent
          postId={id || ''}
          content={content}
          images={images}
          videos={videos}
          files={files}
          mentions={mentions}
          isPostDetail={isPostDetail}
          linkPreview={linkPreview}
        />
        <View style={styles.divider}>
          <Divider color={colors.neutral5} />
        </View>
        {renderFooter()}
        <ViewSpacing height={8} />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    row: {
      flexDirection: 'row',
    },
    footerButtonContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      justifyContent: 'space-between',
    },
    draftText: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    divider: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default PostViewDraft;
