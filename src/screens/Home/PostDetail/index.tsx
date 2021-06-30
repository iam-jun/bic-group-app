import React, {useState} from 'react';
import {StyleSheet, ScrollView, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
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
import MessageOptionsModal from '~/theme/containers/Modal/MessageOptions';
import {mainStack} from '~/configs/navigator';
import Text from '~/theme/components/Text';
import {margin} from '~/theme/configs/spacing';
import {selectComment} from '~/store/comment/actions';
import listActions from '~/store/CRUDList/actions';
import CRUDListView from '~/theme/components/List/CRUDListView';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
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
  const commentOptionsModalRef = React.useRef<Modalize>();

  const _onActionPress = (action: string, item?: any) => {
    switch (action) {
      case commonActions.reactionComment:
        return commentInputRef.current?.focus();

      case commonActions.replyComment:
        dispatch(selectComment(item));
        navigation.navigate(mainStack.reply, {commentFocus: true});
        break;

      case commonActions.emojiCommentReact:
        return commentOptionsModalRef.current?.open();
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
      listActions.createItem('comments', {
        id: generateUniqueId(),
        content,
        user,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        replyCount: 0,
      }),
    );
  };

  const onReactionPress = async (type: string) => {
    console.log('Reacted!');
    commentOptionsModalRef.current?.close();
  };

  const loadMoreComments = () => {
    dispatch(listActions.mergeExtraData('comments', 'comment'));
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
        <CRUDListView
          onActionPress={_onActionPress}
          contentContainerStyle={styles.comment}
          listType="comment"
          dataType="comments"
          inverted={true}
          automaticallyAdjustContentInsets={false}
          scrollEnabled={false}
          ListFooterComponent={
            <>
              <ContentItem
                {...post}
                onActionPress={_onActionPress}
                maxLength={-1}
                showBackButton={true}
              />
              <Text bold style={styles.prevComments} onPress={loadMoreComments}>
                {t('comment:view_previous_comments')}
              </Text>
            </>
          }
        />
      </ScrollView>
      <InputToolbar
        inputRef={commentInputRef}
        commentFocus={commentFocus}
        onSend={onSendComment}
        onActionPress={_onActionPress}
      />
      <MessageOptionsModal
        modalRef={commentOptionsModalRef}
        onReactionPress={onReactionPress}
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
    prevComments: {
      margin: margin.large,
    },
  });
};

export default PostDetailScreen;
