import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {View, StyleSheet, SectionList, RefreshControl} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {
  IAudienceGroup,
  IPayloadGetPostDetail,
  IReaction,
} from '~/interfaces/IPost';
import {useUserIdAuth} from '~/hooks/auth';
import {AppContext} from '~/contexts/AppContext';
import postActions from '~/screens/Post/redux/actions';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import {sortComments} from '../helper/PostUtils';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import PostView from '~/screens/Post/components/PostView';
import CommentInputView from '~/screens/Post/components/CommentInputView';
import LoadMoreComment from '~/screens/Post/components/LoadMoreComment';

const PostDetail = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const params = props?.route?.params;
  const {focusComment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();
  let layoutSetted = useRef(false).current;

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const {streamClient} = useContext(AppContext);

  const id = useKeySelector(postKeySelector.postDetail.id);
  const deleted = useKeySelector(postKeySelector.postDeletedById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const latest_reactions = useKeySelector(
    postKeySelector.postLatestReactionsComments(id),
  );
  const commentCount = useKeySelector(
    postKeySelector.postCommentCountsById(id),
  );

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const listComment = comments || sortComments(latest_reactions) || [];
  const sectionData = getSectionData(listComment) || [];

  const commentLeft = commentCount - listComment.length;

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

  useEffect(() => {
    if (deleted) {
      rootNavigation.goBack();
    }
  }, [deleted]);

  const onRefresh = () => {
    if (userId && id && streamClient) {
      const payload: IPayloadGetPostDetail = {
        userId,
        postId: id,
        streamClient,
      };
      dispatch(postActions.getPostDetail(payload));
    }
  };

  const scrollTo = (sectionIndex = 0, itemIndex = 0) => {
    if (sectionData.length > 0) {
      listRef?.current?.scrollToLocation?.({
        itemIndex: itemIndex,
        sectionIndex: sectionIndex,
        animated: true,
      });
    }
  };

  const onPressComment = () => {
    scrollTo(0, 0);
    textInputRef.current?.focus?.();
  };

  const onCommentSuccess = useCallback(
    ({
      newCommentId,
      parentCommentId,
    }: {
      newCommentId: string;
      parentCommentId?: string;
    }) => {
      console.log(`\x1b[36m🐣️ index newCommentId: ${newCommentId}\x1b[0m`);
      console.log(
        `\x1b[36m🐣️ index parentCommentId: ${parentCommentId}\x1b[0m`,
      );
      let sectionIndex;
      let itemIndex = 0;
      if (parentCommentId) {
        sectionData?.map?.((section, index) => {
          if (section?.comment?.id === parentCommentId) {
            sectionIndex = index;
            itemIndex = (section?.data?.length || 0) + 1;
          }
        });
      } else {
        sectionIndex = sectionData.length - 1;
      }
      scrollTo(sectionIndex, itemIndex);
    },
    [sectionData],
  );

  const renderSectionHeader = (sectionData: any) => {
    const {section} = sectionData || {};
    const {comment, index} = section || {};

    return (
      <CommentItem
        postId={id}
        commentData={comment}
        groupIds={groupIds}
        onPressReply={() => {
          textInputRef.current?.focus?.();
          scrollTo(index, 0);
        }}
      />
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
        onPressReply={() => {
          textInputRef.current?.focus?.();
          scrollTo(section?.index, index + 1);
        }}
      />
    );
  };

  const renderPostContent = () => {
    if (!id) {
      return null;
    }
    return (
      <View style={styles.listHeader}>
        <PostView postId={id} isPostDetail onPressComment={onPressComment} />
        {commentLeft > 0 && (
          <LoadMoreComment
            title={'post:text_load_more_comments'}
            postId={id}
            idLessThan={listComment?.[0]?.id}
          />
        )}
      </View>
    );
  };

  const renderFooter = () => {
    return null;
  };

  const onLayout = useCallback(() => {
    if (!layoutSetted) {
      layoutSetted = true;
      if (focusComment && listComment?.length > 0) {
        setTimeout(() => {
          scrollTo(0, 0);
        }, 500);
      }
    }
  }, [layoutSetted]);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <SectionList
        ref={listRef}
        sections={sectionData}
        renderItem={renderCommentItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderPostContent}
        ListFooterComponent={renderFooter}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View />}
        keyboardShouldPersistTaps={'handled'}
        onLayout={onLayout}
        onContentSizeChange={onLayout}
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.borderDisable}
          />
        }
      />
      <CommentInputView
        postId={id}
        groupIds={groupIds}
        autoFocus={focusComment}
        textInputRef={textInputRef}
        onCommentSuccess={onCommentSuccess}
      />
    </ScreenWrapper>
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
  return result;
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    listHeader: {backgroundColor: colors.background},
  });
};

export default PostDetail;
