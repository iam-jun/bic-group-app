import React, {useState} from 'react';
import {StyleSheet, FlatList, View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import InputToolbar from '~/theme/components/Input/InputToolbar';
import ContentItem from '~/theme/components/List/items/ContentItem';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {post} from './dummy-post-data';
import * as actions from '~/store/comment/actions';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generation';
import useAuth from '~/hooks/auth';
import {useTheme} from 'react-native-paper';
import {ThemeView} from '~/theme/components';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = () => {
  const {user} = useAuth();

  const dispatch = useDispatch();
  const comments = useSelector((state: IObject<any>) => state.comment.comments);
  const theme = useTheme();
  const styles = createStyles(theme);
  const scrollRef = React.createRef<ScrollView>();
  const [isCommentChanged, setCommentchanged] = useState(false);

  const onSendComment = (content: string) => {
    !isCommentChanged && setCommentchanged(true);
    dispatch(
      actions.sendComment({
        id: generateUniqueId(),
        content,
        user,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        replyCount: 0,
      }),
    );
  };

  return (
    <ThemeView isFullView>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          console.log('onContentSizeChange', {scrollRef});
          isCommentChanged && scrollRef.current?.scrollToEnd({animated: true});
        }}
        contentContainerStyle={styles.container}>
        <ListView
          contentContainerStyle={styles.comment}
          type="comment"
          automaticallyAdjustContentInsets={false}
          scrollEnabled={false}
          data={comments.data}
          maintainVisibleContentPosition
          ListHeaderComponent={
            <ContentItem {...post} maxLength={-1} showBackButton={true} />
          }
        />
      </ScrollView>
      <InputToolbar onSend={onSendComment} />
    </ThemeView>
  );
};
const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    comment: {
      paddingVertical: spacing.padding.base,
    },
  });
};

export default PostDetailScreen;
