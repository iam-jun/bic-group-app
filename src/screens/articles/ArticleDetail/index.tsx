import React, {
  FC, memo, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  RefreshControl, SectionList, StyleSheet, View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { useRootNavigation } from '~/hooks/navigation';
import { IAudienceGroup, IMentionUser, IPayloadReactToPost } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';

import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import { ArticlePlaceholder, ArticleView } from '~/components/articles';
import CommentInputView from '~/screens/comments/components/CommentInputView';
import { ReactionType } from '~/constants/reactions';
import useMounted from '~/hooks/mounted';
import { IRouteParams } from '~/interfaces/IRouter';
import useArticlesStore, { IArticlesState } from './store';
import useCommonController from '~/screens/store';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import postActions from '~/storeRedux/post/actions';
import spacing from '~/theme/spacing';
import usePostDetailContentHandler from '~/screens/post/PostDetail/components/PostDetailContent/hooks/usePostDetailContentHandler';
import { getSectionData } from '~/helpers/post';

const _ArticleDetail: FC<IRouteParams> = (props) => {
  const { params } = props.route;
  const id = params?.articleId;
  const focusComment = params?.focusComment;

  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const data = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));

  const comments = useCommentsStore(useCallback(commentsSelector.getCommentsByParentId(id), [id]));
  const firstCommentId = comments[0]?.id || '';
  const sectionData = useMemo(() => getSectionData(comments), [comments]);

  const actions = useArticlesStore((state: IArticlesState) => state.actions);
  const commonController = useCommonController((state) => state.actions);

  const {
    audience, reactionsCount, setting, ownerReactions,
  } = data;

  const {
    onLayout,
    onScrollToIndexFailed,
    onPressReplySectionHeader,
    onPressLoadMoreCommentLevel2,
    onPressReplyCommentItem,
  } = usePostDetailContentHandler({
    postId: id, comments, sectionData, focusComment, listRef, commentInputRef,
  });

  const groupIds = useMemo(() => {
    if (isEmpty(audience?.groups)) return '';

    const ids = audience.groups.map((g: IAudienceGroup) => g?.id);
    return ids?.join?.(',');
  }, [data.audience]);

  const isMounted = useMounted();

  useEffect(() => {
    if (isMounted) { actions.getArticleDetail(id); }
  }, [isMounted]);

  const onRefresh = () => {
    setRefreshing(false);
    actions.getArticleDetail(id);
  };

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId: id }));
  }, [id]);

  const onPressMentionAudience = useRef((user: IMentionUser) => {
    if (audience) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: user.id },
      );
    }
  }).current;

  const onAddReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost('put', payload);
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    if (id) {
      const payload: IPayloadReactToPost = {
        id,
        reactionId,
        ownReaction: ownerReactions,
        reactionsCount,
      };
      commonController.reactToPost('delete', payload);
    }
  };

  const onInitializeEnd = () => {
    setLoaded(true);
  };

  const renderCommentItem = (data: any) => (
    <CommentItem
      postId={id}
      index={data?.index}
      section={data?.section}
      isReplyingComment={false}
      commentData={data?.item}
      groupIds={data?.groupIds}
      commentParent={data?.section?.comment}
      onPressReply={onPressReplyCommentItem}
      onPressMarkSeenPost={onPressMarkSeenPost}
    />
  );

  const renderSeparator = () => <View />;

  const renderSectionHeader = (sectionData: any) => {
    const data = sectionData?.section;

    if (sectionData?.section?.type === 'empty') {
      return <View />;
    }

    return (
      <CommentItem
        postId={id}
        index={data?.index}
        groupIds={groupIds}
        isReplyingComment={false}
        commentData={data?.comment}
        onPressReply={onPressReplySectionHeader}
        onPressLoadMore={onPressLoadMoreCommentLevel2}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const renderFooter = () => {
    if (
      !setting?.canComment
      || sectionData.length === 0
      || sectionData[0].type === 'empty'
    ) {
      return null;
    }

    return <View style={styles.footer} />;
  };

  const renderLoading = () => {
    if (isLoaded) return null;

    return (
      <View style={styles.loadingContainer}>
        <Header
          title="article:title_article_detail"
          titleTextProps={{ useI18n: true }}
        />
        <ArticlePlaceholder disableRandom />
      </View>
    );
  };

  const ListHeaderComponent = (
    <ArticleView
      id={id}
      article={data}
      isLoaded={isLoaded}
      firstCommentId={firstCommentId}
      onAddReaction={onAddReaction}
      onRemoveReaction={onRemoveReaction}
      onInitializeEnd={onInitializeEnd}
      onPressMentionAudience={onPressMentionAudience}
    />
  );

  const RefrestControl = (
    <RefreshControl
      testID="post_detail_content.refresh_control"
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );

  const renderCommentInput = () => {
    if (!setting?.canComment) return null;

    return (
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!focusComment}
      />
    );
  };

  if (!isMounted || !data) return renderLoading();

  return (
    <View style={styles.container}>
      {renderLoading()}
      <Header />
      <View style={styles.contentContainer}>
        <SectionList
          ref={listRef}
          sections={sectionData}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={RefrestControl}
          ListHeaderComponent={ListHeaderComponent}
          onLayout={onLayout}
          onContentSizeChange={onLayout}
          renderItem={renderCommentItem}
          ListFooterComponent={renderFooter}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={renderSeparator}
          onScrollToIndexFailed={onScrollToIndexFailed}
        />

      </View>
      {renderCommentInput()}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.neutral5,
      zIndex: 99,
    },
    footer: {
      height: spacing.margin.base,
      backgroundColor: colors.white,
    },
  });
};

// export default ArticleDetail;

const ArticleDetail = memo(_ArticleDetail);
ArticleDetail.whyDidYouRender = true;
export default ArticleDetail;
