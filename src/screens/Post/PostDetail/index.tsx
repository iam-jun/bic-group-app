import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {IAudienceGroup, IReaction} from '~/interfaces/IPost';
import ListView from '~/beinComponents/list/ListView';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import PostView from '~/screens/Post/components/PostView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import {sortComments} from '../helper/PostUtils';
import CommentInputView from '~/screens/Post/components/CommentInputView';

const PostDetail = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');

  const params = props?.route?.params;
  const {focusComment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();
  let layoutSetted = useRef(false).current;

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  const id = useKeySelector(postKeySelector.postDetail.id);
  const deleted = useKeySelector(postKeySelector.postDeletedById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const latest_reactions = useKeySelector(
    postKeySelector.postLatestReactionsComments(id),
  );

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const data = comments || sortComments(latest_reactions) || [];

  useEffect(() => {
    if (id) {
      dispatch(postActions.getCommentsById({id, isMerge: false}));
    }
  }, [id]);

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
    return <PostView postId={id} isPostDetail />;
  };

  const renderFooter = () => {
    return null;
  };

  const onLayout = useCallback(() => {
    if (!layoutSetted) {
      layoutSetted = true;
      if (focusComment) {
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
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostDetail;
