import React, {useState} from 'react';
import {StyleSheet, ScrollView, TextInput} from 'react-native';
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
import {useBaseHook} from '~/hooks';
import {launchImageLibrary} from 'react-native-image-picker';
import commonActions from '~/constants/commonActions';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = ({route}: {route: any}) => {
  const {t} = useBaseHook();
  const {commentFocus} = route.params || false;
  const commentInputRef = React.useRef<TextInput>(null);

  const {user} = useAuth();

  const dispatch = useDispatch();
  const comments = useSelector((state: IObject<any>) => state.comment.comments);
  const theme = useTheme();
  const styles = createStyles(theme);
  const scrollRef = React.createRef<ScrollView>();
  const [isCommentChanged, setCommentchanged] = useState(false);

  const _onActionPress = (action: string) => {
    switch (action) {
      case commonActions.reactionComment:
        return commentInputRef.current?.focus();
    }
  };

  const openImagePicker = () => {
    launchImageLibrary(
      {mediaType: 'photo'},
      async ({uri, fileName, type}) => {},
    );
  };

  const openFilePicker = () => {};

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
          ListHeaderComponent={
            <ContentItem
              {...post}
              onActionPress={_onActionPress}
              maxLength={-1}
              showBackButton={true}
            />
          }
        />
      </ScrollView>
      <InputToolbar
        inputRef={commentInputRef}
        commentFocus={commentFocus}
        onSend={onSendComment}
        onActionPress={_onActionPress}
      />
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
