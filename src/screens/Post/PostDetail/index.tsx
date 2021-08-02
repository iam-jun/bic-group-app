import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {usePostDetail, usePostDetailReplyingComment} from '~/hooks/post';
import {
  IPostActivity,
  IReaction,
  IRequestPostComment,
} from '~/interfaces/IPost';
import PostView from '~/beinFragments/PostView';
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

const PostDetail = () => {
  const [commentText, setCommentText] = useState('');
  const [listComments, setListComments] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = 9; //todo replace with BEIN userId later...

  const postDetail: IPostActivity = usePostDetail() || {};
  const {id} = postDetail || {};
  const replying = usePostDetailReplyingComment();

  console.log('\x1b[33m', '🐣️ render screen | PostDetail : ', '\x1b[0m');

  const getComments = () => {
    if (id) {
      console.log('\x1b[33m', '🐣️  | getComments : ', '\x1b[0m');
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
    return <PostView postData={postDetail} />;
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
          console.log('\x1b[36m', '🐣️ hahaha |  : ', response, '\x1b[0m');
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
    <ScreenWrapper backgroundColor={colors.placeholder}>
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
        onChangeText={onTextChange}
        onPressSend={onPressSend}
        HeaderComponent={renderCommentInputHeader()}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    commentInputHeader: {
      marginHorizontal: spacing?.margin.base,
      marginTop: spacing?.margin.tiny,
    },
  });
};

export default PostDetail;
