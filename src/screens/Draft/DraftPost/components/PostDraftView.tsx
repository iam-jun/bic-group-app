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
  IPost,
  PostStatus,
} from '~/interfaces/IPost';

import modalActions from '~/storeRedux/modal/actions';
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
import showToastSuccess from '~/store/helper/showToastSuccess';

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

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const { actions } = useDraftPostStore();
  const { showAlert } = useModalStore((state) => state.actions);

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
      const payload: IPayloadGetDraftPosts = { isRefresh: true };
      actions.getDraftPosts(payload);
    }
  };

  const onPressPublish = () => {
    if (id) {
      setPublishing(true);
      const payload: IPayloadPublishDraftPost = {
        draftPostId: id,
        onSuccess: () => {
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
        .deletePost(id)
        .then((response) => {
          if (response?.data) {
            showToastSuccess(response);
            refreshDraftPosts();
          }
        })
        .catch((e) => {
          showToastError(e);
        });
    }
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideModal());
    showAlert({
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
