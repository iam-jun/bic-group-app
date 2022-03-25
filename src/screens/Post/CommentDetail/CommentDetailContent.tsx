import {get} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
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
  const commentInputRef = useRef<any>();
  let countRetryScrollToBottom = useRef(0).current;
  const layoutSet = useRef(false);

  const params = props?.route?.params;
  const {commentData, postId, replyItem, commentParent} = params || {};

  const id = postId;
  const actor = useKeySelector(postKeySelector.postActorById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const comment = useKeySelector(postKeySelector.commentsByParentId(id));
  const commentCount = useKeySelector(
    postKeySelector.postCommentCountsById(id),
  );
  const latest_reactions = useKeySelector(
    postKeySelector.postLatestReactionsComments(id),
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
      if (!!replyItem) {
        setTimeout(() => {
          dispatch(
            postActions.setPostDetailReplyingComment({
              comment: replyItem,
              parentComment: commentParent,
            }),
          );
        }, 50);
      }
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

    scrollToEnd();
  }, []);

  const scrollToEnd = () => {
    listRef.current?.scrollToEnd?.({animated: true});
  };

  const onCommentSuccess = () => {
    scrollToEnd();
  };

  const onScrollToIndexFailed = () => {
    countRetryScrollToBottom = countRetryScrollToBottom + 1;
    if (countRetryScrollToBottom < 20) {
      setTimeout(() => {
        scrollToEnd();
      }, 100);
    }
  };

  const onLayout = useCallback(() => {
    scrollToEnd();
  }, [commentData?.latest_children?.comment?.length]);

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.container}>
          <Text.BodySM>
            {t('post:text_comment_from')}
            <Text.BodyM style={styles.highlightText}>{headerTitle}</Text.BodyM>
          </Text.BodySM>
        </View>
        <CommentItem
          postId={id}
          commentData={commentData}
          groupIds={groupIds}
          index={0}
        />
      </View>
    );
  };

  const renderCommentItem = (data: any) => {
    const {item, index} = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={commentData}
        groupIds={groupIds}
        index={index}
      />
    );
  };

  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  if (loading) {
    return <CommentViewPlaceholder />;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={listRef}
        data={commentData?.latest_children?.comment || []}
        extraData={commentData?.latest_children?.comment}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={commentCount && renderFooter}
        ItemSeparatorComponent={() => <View />}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item, index) =>
          `CommentDetailContent_${index}_${item?.id || ''}`
        }
        onLayout={onLayout}
        onContentSizeChange={scrollToEnd}
        onScrollToIndexFailed={onScrollToIndexFailed}
        scrollEventThrottle={16}
      />
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!replyItem}
        isCommentLevel1Screen
        showHeader
        defaultReplyTargetId={commentData?.id || ''}
        onCommentSuccess={onCommentSuccess}
      />
    </View>
  );
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
    footer: {height: spacing.margin.base, backgroundColor: colors.background},
  });
};

export default CommentDetailContent;
