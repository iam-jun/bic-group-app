import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {usePostDetail} from '~/hooks/post';
import {IPostActivity} from '~/interfaces/IPost';
import PostView from '~/beinFragments/PostView';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import ListView from '~/beinComponents/list/ListView';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import Loading from '~/beinComponents/Loading';

const PostDetail = () => {
  const [commentText, setCommentText] = useState('');
  const [listComments, setListComments] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);

  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const userId = 9; //todo replace with BEIN userId later...

  const postDetail: IPostActivity = usePostDetail() || {};
  const {id} = postDetail || {};

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
    getComments();
  }, []);

  const renderPostContent = () => {
    return <PostView postData={postDetail} />;
  };

  const onTextChange = (text: string) => {
    setCommentText(text);
  };

  const onPressSend = () => {
    const commentData = {
      content: commentText,
    };
    if (id) {
      postDataHelper
        .postNewComment(id, commentData, userId)
        .then(response => {
          if (response && response.data) {
            getComments();
            setCommentText('');
          }
        })
        .catch(e => {
          console.log('\x1b[33m', '🐣️ postNewComment error : ', e, '\x1b[0m');
        });
    }
  };

  const renderCommentItem = ({item}: any) => {
    return <CommentItem commentData={item} />;
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

  return (
    <ScreenWrapper backgroundColor={theme.colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <ListView
        isFullView
        data={listComments}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderPostContent}
        ListFooterComponent={renderFooter}
        renderItemSeparator={() => <View />}
      />
      <CommentInput
        value={commentText}
        onChangeText={onTextChange}
        onPressSend={onPressSend}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostDetail;
