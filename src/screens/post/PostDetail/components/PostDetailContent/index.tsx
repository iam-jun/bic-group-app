import {
  ExtendedTheme,
  useTheme,
} from '@react-navigation/native';
import React, {
  memo,
  useMemo,
  useRef,
} from 'react';
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';

import CommentNotFoundImg from '~/../assets/images/img_comment_not_found.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import CommentInputView from '~/screens/comments/components/CommentInputView';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import PostDetailContentHeader from '../PostDetailContentHeader';
import usePostDetailContent from './hooks/usePostDetailContent';
import usePostDetailContentHandler from './hooks/usePostDetailContentHandler';

const _PostDetailContent = (props) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation, goHome } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyle(theme), [theme]);

  const params = props?.route?.params;
  const { post_id: postId, focus_comment: focusComment, noti_id: notificationId = '' } = params || {};

  const HeaderImageComponent = (
    <View style={{ alignItems: 'center' }}>
      <SVGIcon
        source={CommentNotFoundImg}
        width={120}
        height={120}
        tintColor="none"
      />
    </View>
  );

  const {
    refreshing, isEmptyContent, actor, setting, deleted, createdAt,
    commentLeft, groupIds, comments, sectionData, onRefresh, onPressMarkSeenPost,
  } = usePostDetailContent({ postId, notificationId, HeaderImageComponent });

  const commentInputRef = useRef<any>();

  const listRef = useRef<any>();

  const {
    onLayout,
    onScroll,
    onPressComment,
    onScrollToIndexFailed,
    onPressReplySectionHeader,
    onPressLoadMoreCommentLevel2,
    onPressReplyCommentItem,
  } = usePostDetailContentHandler({
    postId, comments, sectionData, focusComment, listRef, commentInputRef,
  });

  const headerTitle = actor?.fullname
    ? t('post:title_post_detail_of', { name: actor?.fullname })
    : t('post:title_post_detail');

  const onPressBack = () => {
    const newCommentInput = commentInputRef?.current?.getText?.() || '';
    const newCommentSelectedImage = commentInputRef?.current?.hasMedia?.();

    if (newCommentInput !== '' || newCommentSelectedImage) {
      dispatch(
        modalActions.showAlert({
          title: t('post:title_discard_comment'),
          content: t('post:text_discard_comment'),
          cancelBtn: true,
          cancelLabel: t('post:btn_continue_comment'),
          confirmLabel: t('post:btn_discard_comment'),
          onConfirm: () => rootNavigation.goBack(),
        }),
      );
      return;
    }
    if (!rootNavigation.canGoBack) {
      goHome();
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(onPressBack);

  let ListFooterComponent = null;
  if (
    deleted
      || !setting?.canComment
      || sectionData.length === 0
      || sectionData[0].type === 'empty'
  ) {
    ListFooterComponent = <View style={styles.footer} />;
  }

  const renderSectionHeader = (sectionData: any) => {
    const { section } = sectionData || {};
    const { comment, index } = section || {};

    if (sectionData?.section?.type === 'empty') {
      return <View />;
    }

    return (
      <CommentItem
        postId={postId}
        commentData={comment}
        groupIds={groupIds}
        index={index}
        isReplyingComment={false}
        onPressReply={onPressReplySectionHeader}
        onPressLoadMore={onPressLoadMoreCommentLevel2}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const renderCommentItem = (data: any) => {
    const { item, index, section } = data || {};
    return (
      <CommentItem
        index={index}
        postId={postId}
        section={section}
        commentData={item}
        groupIds={groupIds}
        isReplyingComment={false}
        commentParent={section?.comment}
        onPressReply={onPressReplyCommentItem}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const renderContent = () => {
    if (!createdAt) return <PostViewPlaceholder />;

    if (isEmptyContent) return null;

    return (
      <View style={styles.container}>
        <View style={styles.postDetailContainer}>
          <SectionList
            ref={listRef}
            sections={sectionData}
            renderItem={renderCommentItem}
            renderSectionHeader={renderSectionHeader}
            ListHeaderComponent={(
              <PostDetailContentHeader
                id={postId}
                commentLeft={commentLeft}
                idLessThan={comments?.[0]?.id}
                onContentLayout={props?.onContentLayout}
                onPressComment={onPressComment}
              />
            )}
            ListFooterComponent={ListFooterComponent}
            stickySectionHeadersEnabled={false}
            ItemSeparatorComponent={() => <View />}
            keyboardShouldPersistTaps="handled"
            onLayout={onLayout}
            onContentSizeChange={onLayout}
            onScroll={onScroll}
            onScrollToIndexFailed={onScrollToIndexFailed}
            refreshControl={(
              <RefreshControl
                testID="post_detail_content.refresh_control"
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.gray40}
              />
            )}
          />

          {setting?.canComment && (
            <CommentInputView
              commentInputRef={commentInputRef}
              postId={postId}
              groupIds={groupIds}
              autoFocus={focusComment}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex1}>
      <Header title={headerTitle} onPressBack={onPressBack} />
      {renderContent()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    refreshing: {
      padding: spacing.padding.base,
    },
    container: {
      flex: 1,
    },
    postDetailContainer: {
      flex: 1,
    },
    footer: { height: spacing.margin.base, backgroundColor: colors.white },
  });
};

const PostDetailContent = memo(_PostDetailContent);
// PostDetailContent.whyDidYouRender = true;
export default PostDetailContent;
