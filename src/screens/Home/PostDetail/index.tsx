import React, {useState} from 'react';
import {StyleSheet, ScrollView, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import InputToolbar from '~/components/inputs/InputToolbar';
import ContentItem from '~/components/list/items/ContentItem';
import {spacing} from '~/theme';
import {post} from './dummy-post-data';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generator';
import useAuth from '~/hooks/auth';
import {useTheme} from 'react-native-paper';
import {ScreenWrapper, ViewSpacing} from '~/components';
import {useBaseHook} from '~/hooks';
import {launchImageLibrary} from 'react-native-image-picker';
import commonActions from '~/constants/commonActions';
import MessageOptionsModal from '~/components/fragments/optionModals/MessageOptions';
import {mainStack} from '~/configs/navigator';
import Text from '~/components/texts/Text';
import {margin} from '~/theme/spacing';
import * as actions from '~/store/comment/actions';
import * as listActions from '~/store/CRUDList/actions';
import CRUDListView from '~/components/list/CRUDListView';
import useCRUDList from '~/hooks/CRUDList';

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
  const commentOptionsModalRef = React.useRef<Modalize>();
  const list = useCRUDList('comments');

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
        <CRUDListView
          style={styles.comment}
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
                {list.loadingMore
                  ? t('common:text_loading')
                  : t('comment:view_previous_comments')}
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
