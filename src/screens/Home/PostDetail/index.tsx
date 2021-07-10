import React, {useState} from 'react';
import {StyleSheet, ScrollView, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';

import InputToolbar from '~/components/inputs/InputToolbar';
import ContentItem from '~/components/list/items/ContentItem';
import ListView from "~/components/list/ListView"
import {spacing} from '~/theme';
import {post} from './dummy-post-data';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generator';
import useAuth from '~/hooks/auth';
import {ScreenWrapper, ViewSpacing} from '~/components';
import {useBaseHook} from '~/hooks';
import commonActions from '~/constants/commonActions';
import {options} from '~/constants/postOptions';
import MessageOptionsModal from '~/components/fragments/optionModals/MessageOptions';
import {mainStack} from '~/configs/navigator';
import Text from '~/components/texts/Text';
import {margin} from '~/theme/spacing';
import * as actions from '~/screens/Comment/redux/actions';
import PostOptionsModal from '~/components/fragments/optionModals/PostOptions';
import {IOption} from '~/interfaces/IOption';
import {IOptionModal} from '~/components/modals/OptionModal';

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
  const theme = useTheme();
  const styles = createStyles(theme);
  const scrollRef = React.createRef<ScrollView>();
  const [isCommentChanged, setCommentchanged] = useState(false);
  const commentOptionsModalRef = React.useRef<IOptionModal>();
  const postOptionsModalRef = React.useRef<IOptionModal>();

  const _onActionPress = (action: string, item?: any) => {
    switch (action) {
      case commonActions.reactionComment:
        return commentInputRef.current?.focus();

      case commonActions.replyComment:
        dispatch(actions.selectComment(item));
        navigation.navigate(mainStack.reply, {commentFocus: true});
        break;

      case commonActions.emojiCommentReact:
        return commentOptionsModalRef.current?.open();

      case commonActions.openPostOption:
        return postOptionsModalRef.current?.open();
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

    // dispatch(
    //   listActions.createItem('comments', {
    //     id: generateUniqueId(),
    //     content,
    //     user,
    //     createdAt: new Date().toISOString(),
    //     updateAt: new Date().toISOString(),
    //     replyCount: 0,
    //   }),
    // );
  };

  const onReactionPress = async (type: string) => {
    console.log('Reacted!');
    commentOptionsModalRef.current?.close();
  };

  const loadMoreComments = () => {
    // dispatch(listActions.mergeExtraData('comments', 'comment'));
  };

  const onMenuPress = async (menu: IOption) => {
    switch (menu.type) {
      case options.HIDE:
        console.log('Hide post!');
        break;

      case options.EDIT:
        console.log('Edit post!');
        break;

      case options.DELETE:
        console.log('Delete post!');
        break;
    }
  };

  return (
    <ScreenWrapper isFullView>
      <ViewSpacing height={spacing.margin.large} />
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
          style={styles.comment}
          onActionPress={_onActionPress}
          contentContainerStyle={styles.comment}
          type="comment"
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
                {/*{list.loadingMore*/}
                {/*  ? t('common:text_loading')*/}
                {/*  : t('comment:view_previous_comments')}*/}
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
        ref={commentOptionsModalRef}
        onReactionPress={onReactionPress}
      />
      <PostOptionsModal ref={postOptionsModalRef} onMenuPress={onMenuPress} />
    </ScreenWrapper>
  );
};
const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    comment: {
      paddingBottom: spacing.padding.large,
    },
    prevComments: {
      margin: margin.large,
    },
  });
};

export default PostDetailScreen;
