import React, { FC, useState } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import streamApi from '~/api/StreamApi';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';

import {
  IPayloadGetDraftContents,
  IPayloadPutEditPost,
  IPost,
  PostStatus,
} from '~/interfaces/IPost';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Divider from '~/beinComponents/Divider';
import useDraftPostStore from '../store';
import { PostBody, PostHeader, PostImportant } from '~/components/posts';
import useModalStore from '~/store/modal';
import showToastError from '~/store/helper/showToastError';
import useDraftContentsStore from '../../DraftContents/store';
import usePostsStore from '~/store/entities/posts';

export interface PostDraftViewProps {
  data: IPost;
  style?: StyleProp<ViewStyle>;
  isPostDetail?: boolean;
}

const onDoNothing = () => true;

const PostDraftView: FC<PostDraftViewProps> = ({
  data,
  style,
  isPostDetail = false,
}: PostDraftViewProps) => {
  const [publishing, setPublishing] = useState(false);

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const postsStoreActions = usePostsStore((state) => state.actions);

  const { actions } = useDraftPostStore();
  const actionsDraftContentsStore = useDraftContentsStore((state) => state.actions);
  const modalActions = useModalStore((state) => state.actions);

  const {
    id,
    audience,
    content,
    setting,
    status,
    communities,
  } = data || {};

  const { isImportant, importantExpiredAt } = setting || {};
  const isProcessing = status === PostStatus.PROCESSING;

  const disableButtonPost = publishing
    || !content
    || (audience?.groups?.length === 0 && audience?.users?.length === 0);

  const refreshDraftPosts = () => {
    if (userId) {
      const payload: IPayloadGetDraftContents = { isRefresh: true };
      actions.getDraftPosts(payload);
      actionsDraftContentsStore.getDraftContents(payload);
    }
  };

  const onPressPublish = () => {
    if (id) {
      setPublishing(true);
      const payload: IPayloadPutEditPost = {
        id,
        disableNavigate: true,
        msgSuccess: 'post:draft:text_draft_post_published',
        isPublish: true,
        onError: () => setPublishing(false),
        isHandleSeriesTagsError: false,
      };
      postsStoreActions.putEditPost(payload);
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
    modalActions.hideModal();
    if (id) {
      streamApi
        .deletePost(
          id,
        )
        .then((response) => {
          if (response?.data) {
            modalActions.showToast({ content: 'post:draft:text_draft_deleted' });
            refreshDraftPosts();
          }
        })
        .catch((e) => {
          showToastError(e);
        });
    }
  };

  const onPressDelete = () => {
    modalActions.hideModal();
    modalActions.showAlert({
      title: t('post:title_delete_post'),
      content: t('post:content_delete_post'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: onDelete,
    });
  };

  const renderFooter = () => {
    if (isProcessing) {
      return (
        <Text.BodyS
          testID="post_draft_view.post_processing_publish"
          color={colors.gray50}
          style={styles.draftText}
        >
          {t('post:draft:text_processing_publish')}
        </Text.BodyS>
      );
    }
    return (
      <View style={[styles.row, styles.footerButtonContainer]}>
        <View style={styles.row}>
          <Button.Danger
            testID="post_draft_view.button_delete"
            type="ghost"
            icon="TrashCan"
            onPress={onPressDelete}
          />
          <ViewSpacing width={16} />
          <Button.Secondary
            testID="post_draft_view.button_edit"
            type="ghost"
            icon="PenToSquare"
            onPress={onPressEdit}
          />
        </View>
        <Button.Primary
          testID="post_draft_view.button_publish"
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
      <PostImportant
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
        markedReadPost={false}
        listCommunity={communities}
      />
      <View style={[styles.container, style]}>
        <PostHeader
          data={data}
          onPressHeader={onDoNothing}
        />
        <PostBody
          data={data}
          isPostDetail={isPostDetail}
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

export default PostDraftView;
