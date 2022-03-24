import {get} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
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

  const sectionData = getSectionData([commentData]);

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
  }, []);

  useEffect(() => {
    const _commentData = get(commentData, 'latest_children.comment', []);
    const timer = setTimeout(() => {
      scrollTo(0, _commentData?.length > 0 ? _commentData.length : -1);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const scrollTo = (sectionIndex = 0, itemIndex = 0) => {
    if (sectionData.length > 0) {
      try {
        listRef.current?.scrollToLocation?.({
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
      scrollTo(0, -1);
    }
  }, [layoutSet]);

  const onCommentSuccess = useCallback(
    ({
      newCommentId,
      parentCommentId,
    }: {
      newCommentId: string;
      parentCommentId?: string;
    }) => {
      scrollTo(0, -1);
    },
    [sectionData],
  );

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
      <SectionList
        ref={listRef}
        sections={sectionData}
        renderItem={renderCommentItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeaderText}
        ListFooterComponent={commentCount && renderFooter}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View />}
        keyboardShouldPersistTaps={'handled'}
        onLayout={onLayout}
        onContentSizeChange={onLayout}
        //   onScrollToIndexFailed={onScrollToIndexFailed}
        keyExtractor={(item, index) =>
          `CommentDetailContent_${index}_${item?.id || ''}`
        }
      />
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!replyItem}
        isCommentLevel1Screen
        showHeader
        defaultReplyTargetId={commentData?.id || ''}
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
    footer: {height: spacing.margin.base, backgroundColor: colors.background},
  });
};

export default CommentDetailContent;
