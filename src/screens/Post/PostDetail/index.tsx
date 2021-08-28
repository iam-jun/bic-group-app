import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {IAudienceGroup, IReaction} from '~/interfaces/IPost';
import ListView from '~/beinComponents/list/ListView';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import {useDispatch} from 'react-redux';
import PostView from '~/screens/Post/components/PostView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import {sortComments} from '../helper/PostUtils';
import CommentInputView from '~/screens/Post/components/CommentInputView';
import LoadMoreComment from '~/screens/Post/components/LoadMoreComment';

const PostDetail = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');

  const params = props?.route?.params;
  const {focusComment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();
  let layoutSetted = useRef(false).current;

  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

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
  const data = comments || sortComments(latest_reactions) || [];

  const commentLeft = commentCount - data.length;

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

  const renderCommentItem = ({
    item,
    index,
  }: {
    item: IReaction;
    index: number;
  }) => {
    return (
      <CommentItem
        postId={id}
        commentData={item}
        groupIds={groupIds}
        onPressReply={(data, isChild) => {
          textInputRef.current?.focus?.();
          if (!isChild) {
            listRef.current?.scrollToIndex({index: index});
          }
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
        <PostView postId={id} isPostDetail />
        {commentLeft > 0 && (
          <LoadMoreComment
            title={'post:text_load_more_comments'}
            postId={id}
            idLessThan={data?.[0]?.id}
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
      if (focusComment && data?.length > 0) {
        setTimeout(() => {
          listRef?.current?.scrollToIndex?.({index: 0, animated: true});
        }, 500);
      }
    }
  }, [layoutSetted]);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <ListView
        listRef={listRef}
        isFullView
        data={data}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderPostContent}
        ListFooterComponent={renderFooter}
        renderItemSeparator={() => <View />}
        keyboardShouldPersistTaps={'handled'}
        onLayout={onLayout}
        onContentSizeChange={onLayout}
      />
      <CommentInputView
        postId={id}
        groupIds={groupIds}
        autoFocus={focusComment}
        textInputRef={textInputRef}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    listHeader: {backgroundColor: colors.background},
  });
};

export default PostDetail;
