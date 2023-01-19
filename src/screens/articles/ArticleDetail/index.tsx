import React, {
  FC, memo, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  RefreshControl, SectionList, StyleSheet, View,
} from 'react-native';

import { ExtendedTheme, useTheme, useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { IAudienceGroup } from '~/interfaces/IPost';

import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { ArticlePlaceholder, ArticleView } from '~/components/articles';
import CommentInputView from '~/screens/comments/components/CommentInputView';
import useMounted from '~/hooks/mounted';
import { IRouteParams } from '~/interfaces/IRouter';
import useArticlesStore, { IArticlesState } from './store';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import postActions from '~/storeRedux/post/actions';
import spacing from '~/theme/spacing';
import usePostDetailContentHandler from '~/screens/post/PostDetail/components/PostDetailContent/hooks/usePostDetailContentHandler';
import { getSectionData } from '~/helpers/post';
import { useRootNavigation } from '~/hooks/navigation';
import ContentUnavailable from '~/components/ContentUnavailable';
import BannerReport from '~/components/Report/BannerReport';

const _ArticleDetail: FC<IRouteParams> = (props) => {
  const { params } = props.route;
  const id = params?.articleId;
  const focusComment = params?.focusComment;
  const isFocused = useIsFocused();
  const { rootNavigation } = useRootNavigation();

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const [refreshing, setRefreshing] = useState(false);
  const data = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));

  const comments = useCommentsStore(useCallback(commentsSelector.getCommentsByParentId(id), [id]));
  const firstCommentId = comments[0]?.id || '';
  const sectionData = useMemo(() => getSectionData(comments), [comments]);

  const { actions, errors } = useArticlesStore((state: IArticlesState) => state);
  const isFetchError = errors[id];

  const { audience, setting, reported } = data || {};

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

  useEffect(() => {
    if (reported && isFocused) {
      setTimeout(() => {
        rootNavigation.goBack();
      }, 200);
    }
  }, [reported, isFocused]);

  const onRefresh = () => {
    setRefreshing(false);
    actions.getArticleDetail(id);
  };

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId: id }));
  }, [id]);

  const renderCommentItem = (data: any) => (
    <CommentItem
      postId={id}
      index={data?.index}
      section={data?.section}
      isReplyingComment={false}
      commentData={data?.item}
      groupIds={data?.groupIds}
      audience={audience}
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
        audience={audience}
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
      return <View style={styles.footer} />;
    }

    return null;
  };

  const renderLoading = () => (
    <View testID="article_detail.placeholder" style={styles.loadingContainer}>
      <Header
        title="article:title:detail"
        titleTextProps={{ useI18n: true }}
      />
      <ArticlePlaceholder disableRandom />
    </View>
  );

  const ListHeaderComponent = (
    <ArticleView
      id={id}
      article={data}
      firstCommentId={firstCommentId}
    />
  );

  const RefrestControl = (
    <RefreshControl
      testID="article_detail.refresh_control"
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

  if (!isMounted || !data || (isEmpty(data) && !isFetchError)) return renderLoading();

  if (isFetchError) {
    return <ContentUnavailable />;
  }
  return (
    <ScreenWrapper
      testID="article_detail"
      backgroundColor={colors.neutral5}
      isFullView
    >
      <Header />
      <BannerReport postId={id} />
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
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
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
