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

const PostDetail = (props: any) => {
  const [commentText, setCommentText] = useState('');
  const [listComments, setListComments] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);

  const params = props?.route?.params;
  const {focusComment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const id = useKeySelector(postKeySelector.postDetail.id);
  const replying = usePostDetailReplyingComment();

  const getComments = () => {
    if (id) {
      setLoadingComment(true);
      postDataHelper
        .getPostComment(id)
        .then(response => {
          if (response && response.data) {
            setListComments(response.data);
          }
          setLoadingComment(false);
        })
        .catch(e => {
          setLoadingComment(false);
          console.log('\x1b[36m', '🐣️ getPostComment error : ', e, '\x1b[0m');
        });
    }
  };

  useEffect(() => {
    dispatch(postActions.setPostDetailReplyingComment());
    getComments();
  }, []);

  const renderPostContent = () => {
    if (!id) {
      return null;
    }
    return <PostView postId={id} />;
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
            getComments();
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
        commentData={item}
        contentBackgroundColor={bgColor}
        onPressReply={data => {
          textInputRef.current?.focus?.();
          listRef.current?.scrollToIndex({index: index});
        }}
      />
    );
  };

  const renderFooter = () => {
    return (
      <View>
        {loadingComment && (
          <Loading style={{margin: theme.spacing?.margin.base}} />
        )}
      </View>
    );
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
          <Icon
            icon={'iconClose'}
            onPress={() => dispatch(postActions.setPostDetailReplyingComment())}
          />
        </View>
        <Text.Subtitle
          color={colors.textSecondary}
          numberOfLines={1}>{`${replying.data?.content}`}</Text.Subtitle>
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <ListView
        listRef={listRef}
        isFullView
        data={listComments}
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
