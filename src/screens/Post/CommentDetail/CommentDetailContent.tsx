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

import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IAudienceGroup, IReaction} from '~/interfaces/IPost';
import {ITheme} from '~/theme/interfaces';
import CommentInputView from '../components/CommentInputView';
import {sortComments} from '../helper/PostUtils';
import postKeySelector from '../redux/keySelector';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const listRef = useRef<any>();
  const layoutSet = useRef(false);
  const commentInputRef = useRef<any>();
  const internetReachableRef = useRef(true);

  const params = props?.route?.params;
  const {post_id, focus_comment} = params || {};

  const id = post_id;
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
  const sectionData = getSectionData(listComment) || [];

  //    const commentLeft = commentCount - listComment.length;

  //    const user: IUserResponse | boolean = Store.getCurrentUser();

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

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

  const onCommentSuccess = () => {};
  //   const onCommentSuccess = useCallback(
  //     ({
  //       newCommentId,
  //       parentCommentId,
  //     }: {
  //       newCommentId: string;
  //       parentCommentId?: string;
  //     }) => {
  //       let sectionIndex;
  //       let itemIndex = 0;
  //       if (parentCommentId) {
  //         sectionData?.map?.((section, index) => {
  //           if (section?.comment?.id === parentCommentId) {
  //             sectionIndex = index;
  //             itemIndex = section?.data?.length || 0;
  //           }
  //         });
  //       } else {
  //         sectionIndex = sectionData.length - 1;
  //       }
  //       scrollTo(sectionIndex, itemIndex);
  //     },
  //     [sectionData],
  //   );

  const onPressReplySectionHeader = () => {};

  const renderHeaderText = () => {
    const ctaText = t('post:title_comment_detail_of').replace(
      '%NAME%',
      'searchText',
    );
    return (
      <View style={styles.container}>
        <Text.BodyM useI18n>post:text_comment_from</Text.BodyM>
        <Text.BodyM useI18n style={styles.highlightText}>
          {ctaText}
        </Text.BodyM>
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

  return (
    <View style={{flex: 1}}>
      {/* <View style={styles.postDetailContainer}> */}
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
        //   onLayout={onLayout}
        //   onContentSizeChange={onLayout}
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
      {/* </View> */}
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
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    highlightText: {
      color: colors.link,
    },
  });
};

export default CommentDetailContent;
