import {get} from 'lodash';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import CommentItem from '~/beinComponents/list/items/CommentItem';
import CommentViewPlaceholder from '~/beinComponents/placeholder/CommentViewPlaceholder';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import {IAudienceGroup, IReaction} from '~/interfaces/IPost';
import {ITheme} from '~/theme/interfaces';
import CommentInputView from '../components/CommentInputView';
import {sortComments} from '../helper/PostUtils';
import postActions from '../redux/actions';
import postKeySelector from '../redux/keySelector';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const listRef = useRef<any>();
  const layoutSet = useRef(false);
  const commentInputRef = useRef<any>();
  const internetReachableRef = useRef(true);

  const params = props?.route?.params;
  const {commentData, postId, focus_comment, replyItem, commentParent} =
    params || {};

  const id = postId;
  const actor = useKeySelector(postKeySelector.postActorById(id));
  const deleted = useKeySelector(postKeySelector.postDeletedById(id));
  const postTime = useKeySelector(postKeySelector.postTimeById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const latest_reactions = useKeySelector(
    postKeySelector.postLatestReactionsComments(id),
  );
  const commentCount = useKeySelector(
    postKeySelector.postCommentCountsById(id),
  );
  const scrollToLatestItem = useKeySelector(postKeySelector.scrollToLatestItem);

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const listComment = comments || sortComments(latest_reactions) || [];

  const sectionData = useMemo(
    () => getSectionData([commentData]),
    [commentData],
  );

  const headerTitle = t('post:title_comment_detail_of').replace(
    '%NAME%',
    actor?.data?.fullname || '',
  );

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

  useEffect(() => {
    const _commentData = get(commentData, 'latest_children.comment', []);
    if (_commentData.length > 1 || !_commentData?.[0]) {
      setLoading(false);
      return;
    } else {
      dispatch(
        postActions.getCommentsByPostId({
          postId: postId,
          idLt: _commentData?.[0]?.id || '',
          commentId: commentData?.id || '',
          recentReactionsLimit: 9,
          isMerge: true,
          callbackLoading: loading => {
            setLoading(loading);
            if (!loading && !!replyItem) {
              dispatch(
                postActions.setPostDetailReplyingComment({
                  comment: replyItem,
                  parentComment: commentParent,
                }),
              );
            }
          },
        }),
      );
    }
  }, []);

  const scrollTo = (sectionIndex = 0, itemIndex = 0) => {
    if (sectionData.length > 0) {
      if (sectionIndex > sectionData.length - 1 || sectionIndex === -1) {
        sectionIndex = sectionData.length - 1;
      }
      if (
        itemIndex > sectionData?.[sectionIndex]?.data?.length ||
        itemIndex === -1
      ) {
        itemIndex = sectionData?.[sectionIndex]?.data?.length || 0;
      }

      try {
        listRef?.current?.scrollToLocation?.({
          itemIndex: itemIndex,
          sectionIndex: sectionIndex,
          animated: true,
        });
      } catch (error) {
        // scroll to the first comment to avoid scroll error
        listRef?.current?.scrollToLocation?.({
          itemIndex: 0,
          sectionIndex: 0,
          animated: true,
        });
      }
    }
  };

  const onLayout = useCallback(() => {
    if (!layoutSet.current) {
      layoutSet.current = true;
      if (focus_comment && listComment?.length > 0) {
        //limit section index to default comment length = 10 to avoid scroll crash. it happen when init with large amount of comment, then scroll, then reload, result only 10 latest comment, scroll to out of index
        const sectionIndex = Math.min(9, sectionData.length - 1);
        scrollTo(sectionIndex, -1);
      }
    }
  }, [layoutSet, sectionData.length, focus_comment, listComment?.length]);

  // const onPressReplyCommentItem = useCallback(
  //   (commentData, section, index) => {
  //       scrollTo(section?.index, index + 1);
  //       // set time out to wait hide context menu on web
  //       setTimeout(() => {
  //         commentInputRef?.current?.focus?.();
  //       }, 200);

  //   },
  //   [sectionData],
  // );
  const onPressReplyCommentItem = () => {};

  const onCommentSuccess = useCallback(
    ({
      newCommentId,
      parentCommentId,
    }: {
      newCommentId: string;
      parentCommentId?: string;
    }) => {
      let sectionIndex;
      let itemIndex = 0;
      if (parentCommentId) {
        sectionData?.map?.((section, index) => {
          if (section?.comment?.id === parentCommentId) {
            sectionIndex = index;
            itemIndex = section?.data?.length || 0;
          }
        });
      } else {
        sectionIndex = sectionData.length - 1;
      }
      scrollTo(sectionIndex, itemIndex);
    },
    [sectionData],
  );

  const onPressReplySectionHeader = () => {};

  const renderHeaderText = () => {
    return (
      <View style={styles.container}>
        <Text.BodySM>
          {t('post:text_comment_from')}
          <Text.BodyM style={styles.highlightText}>{headerTitle}</Text.BodyM>
        </Text.BodySM>
      </View>
    );
  };

  const renderCommentItem = (data: any) => {
    const {item, index, section} = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={section?.comment}
        groupIds={groupIds}
        index={index}
        section={section}
        onPressReply={onPressReplyCommentItem}
      />
    );
  };

  const renderSectionHeader = (sectionData: any) => {
    const {section} = sectionData || {};
    const {comment, index} = section || {};
    if (sectionData?.section?.type === 'empty') {
      return <View />;
    }

    return (
      <CommentItem
        postId={id}
        commentData={comment}
        groupIds={groupIds}
        index={index}
        onPressReply={onPressReplySectionHeader}
      />
    );
  };

  if (loading) {
    return <CommentViewPlaceholder />;
  }

  return (
    <View style={{flex: 1}}>
      <SectionList
        ref={listRef}
        sections={sectionData}
        renderItem={renderCommentItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeaderText}
        //   ListFooterComponent={commentCount && renderFooter}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View />}
        keyboardShouldPersistTaps={'handled'}
        onLayout={onLayout}
        onContentSizeChange={onLayout}
        //   onScrollToIndexFailed={onScrollToIndexFailed}
        //   refreshControl={
        //     <RefreshControl
        //       refreshing={refreshing}
        //       onRefresh={onRefresh}
        //       tintColor={colors.borderDisable}
        //     />
        //   }
      />
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!focus_comment}
        onCommentSuccess={onCommentSuccess}
      />
    </View>
  );
};

const getSectionData = (listComment: IReaction[]) => {
  const result: any[] = [];
  listComment?.map?.((comment, index) => {
    const item: any = {};
    item.comment = comment;
    item.index = index;
    item.data = comment?.latest_children?.comment || [];
    result.push(item);
  });
  // long post without comment cant scroll to bottom
  // so need default list with an empty item to trigger scroll
  return result?.length > 0 ? result : [];
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, fonts, fontFamily} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    highlightText: {
      color: colors.link,
    },
    headerText: {
      fontSize: 14,
    },
  });
};

export default CommentDetailContent;
