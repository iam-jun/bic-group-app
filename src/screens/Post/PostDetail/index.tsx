import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {usePostDetailReplyingComment} from '~/hooks/post';
import {IReaction, IRequestPostComment} from '~/interfaces/IPost';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import ListView from '~/beinComponents/list/ListView';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import Loading from '~/beinComponents/Loading';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import Icon from '~/beinComponents/Icon';
import {useUserIdAuth} from '~/hooks/auth';
import PostView from '~/screens/Post/components/PostView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import {sortComments} from '~/screens/Post/helper/PostUtils';

const PostDetail = (props: any) => {
  const [commentText, setCommentText] = useState('');

  const params = props?.route?.params;
  const {focusComment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const id = useKeySelector(postKeySelector.postDetail.id);
  const deleted = useKeySelector(postKeySelector.postDeletedById(id));
  const latest_reactions = useKeySelector(
    postKeySelector.postLatestReactionsComments(id),
  );
  const replying = usePostDetailReplyingComment();

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));

  useEffect(() => {
    if (id) {
      dispatch(postActions.getCommentsById({id, isMerge: false}));
    }
  }, [id]);

  useEffect(() => {
    dispatch(postActions.setPostDetailReplyingComment());
  }, []);

  useEffect(() => {
    if (deleted) {
      rootNavigation.goBack();
    }
  }, [deleted]);

  const renderPostContent = () => {
    if (!id) {
      return null;
    }
    return <PostView postId={id} isPostDetail />;
  };

  const onTextChange = (text: string) => {
    setCommentText(text);
  };

  const onPressSend = () => {
    if (id) {
      const commentData = {
        content: commentText?.trim(),
      };
      const replyCmtId = replying?.id;
      const requestData: IRequestPostComment = {
        referenceId: replyCmtId || id,
        referenceType: replyCmtId ? 'comment' : 'post',
        commentData,
        userId,
      };
      postDataHelper
        .postNewComment(requestData)
        .then(response => {
          if (response && response.data) {
            setCommentText('');
            dispatch(postActions.setPostDetailReplyingComment());
          }
        })
        .catch(e => {
          console.log('\x1b[33m', '🐣️ postNewComment error : ', e, '\x1b[0m');
        });
    } else {
      console.log('\x1b[31m', '🐣️  | onPressSend : invalid id ', '\x1b[0m');
    }
  };

  const renderCommentItem = ({
    item,
    index,
  }: {
    item: IReaction;
    index: number;
  }) => {
    const bgColor = item.id === replying?.id ? colors.bgFocus : undefined;
    return (
      <CommentItem
        postId={id}
        commentData={item}
        contentBackgroundColor={bgColor}
        onPressReply={(data, isChild) => {
          textInputRef.current?.focus?.();
          if (!isChild) {
            listRef.current?.scrollToIndex({index: index});
          }
        }}
      />
    );
  };

  const renderFooter = () => {
    return null;
  };

  const renderCommentInputHeader = () => {
    if (!replying) {
      return null;
    }
    return (
      <View style={styles.commentInputHeader}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 1}}>
            <Text>
              {t('post:reply_comment_1')}
              <Text.BodyM>
                {replying?.user?.data?.fullname || t('post:someone')}
              </Text.BodyM>
              <Text>{t('post:reply_comment_2')}</Text>
            </Text>
          </Text>
          <Button
            onPress={() =>
              dispatch(postActions.setPostDetailReplyingComment())
            }>
            <Text.BodyS>
              {'• '}
              <Text.BodyM useI18n color={colors.primary7}>
                common:btn_cancel
              </Text.BodyM>
            </Text.BodyS>
          </Button>
        </View>
        {/*<Text.Subtitle*/}
        {/*  color={colors.textSecondary}*/}
        {/*  numberOfLines={1}>{`${replying.data?.content}`}</Text.Subtitle>*/}
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <ListView
        listRef={listRef}
        isFullView
        data={comments || sortComments(latest_reactions) || []}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderPostContent}
        ListFooterComponent={renderFooter}
        renderItemSeparator={() => <View />}
        keyboardShouldPersistTaps={'handled'}
      />
      <CommentInput
        textInputRef={textInputRef}
        value={commentText}
        autoFocus={focusComment}
        onChangeText={onTextChange}
        onPressSend={onPressSend}
        HeaderComponent={renderCommentInputHeader()}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    commentInputHeader: {
      marginHorizontal: spacing?.margin.base,
      marginTop: spacing?.margin.tiny,
    },
  });
};

export default PostDetail;
