import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import NodeEmoji from 'node-emoji';
import { useBaseHook } from '~/hooks';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import { ReactionType } from '~/constants/reactions';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import * as modalActions from '~/storeRedux/modal/actions';
import { showHideToastMessage } from '~/storeRedux/modal/actions';
import Text from '~/baseComponents/Text';
import { quickReactions } from '~/configs/reactionConfig';
import { getLink, LINK_COMMENT } from '~/utils/link';
import spacing from '~/theme/spacing';
import BottomListItem from '~/components/BottomList/BottomListItem';

export interface CommentViewMenuProps {
  commentId: string;
  parentCommentId?: string;
  postId?: string;
  content: string;
  groupIds: string;
  isActor: boolean;
  onPressMoreReaction: (e: any) => void;
  onAddReaction: (reactionId: ReactionType) => void;
  onPressReply: () => void;
  onPressDelete: () => void;
}

const CommentViewMenu: FC<CommentViewMenuProps> = ({
  commentId,
  parentCommentId,
  content,
  groupIds,
  postId,
  isActor,
  onPressMoreReaction,
  onAddReaction,
  onPressReply,
  onPressDelete,
}: CommentViewMenuProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(
    theme, insets,
  );

  const _onPressReaction = (emoji: any) => {
    dispatch(modalActions.hideModal());
    onAddReaction?.(NodeEmoji.find(emoji || '')?.key || '');
  };

  const _onPressMoreReaction = (e?: any) => {
    dispatch(modalActions.hideModal());
    onPressMoreReaction?.(e);
  };

  const _onPressEdit = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(
      homeStack.createComment, {
        commentId,
        groupIds,
      },
    );
  };

  const _onPress = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const _onPressDelete = () => {
    dispatch(modalActions.hideModal());
    onPressDelete?.();
  };

  const _onPressReply = () => {
    dispatch(modalActions.hideModal());
    onPressReply?.();
  };

  const _onPressCopy = () => {
    dispatch(modalActions.hideModal());
    if (content) {
      Clipboard.setString(content);
      dispatch(showHideToastMessage({ content: 'common:text_copied_to_clipboard' }));
    }
  };

  const _onPressCopyLink = () => {
    dispatch(modalActions.hideModal());
    Clipboard.setString(getLink(
      LINK_COMMENT, postId, {
        commentId,
        parentId: parentCommentId || '',
      },
    ));
    dispatch(showHideToastMessage({ content: 'post:comment_link_copied' }));
  };

  const renderReactItem = (
    item: any, index: number,
  ) => (
    <Button
      testID={`comment_view_menu.react_${index}`}
      key={`reaction_${index}_${item.id}`}
      onPress={() => _onPressReaction(item)}
    >
      <Text style={styles.reactionText}>{item}</Text>
    </Button>
  );

  const renderReact = () => (
    <View style={styles.reactContainer}>
      {quickReactions.map(renderReactItem)}
      <Button
        testID="comment_view_menu.more_react"
        style={styles.btnReact}
        onPress={_onPressMoreReaction}
      >
        <Icon icon="iconReact" size={22} />
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderReact()}
      <BottomListItem
        testID="comment_view_menu.reply"
        leftIcon="ArrowTurnDownRight"
        title={t('post:comment_menu_reply')}
        onPress={_onPressReply}
      />
      <BottomListItem
        testID="comment_view_menu.copy"
        leftIcon="Copy"
        title={t('post:comment_menu_copy_text')}
        onPress={_onPressCopy}
      />
      <BottomListItem
        testID="comment_view_menu.copy_link"
        leftIcon="Link"
        title={t('post:comment_menu_copy_link')}
        onPress={_onPressCopyLink}
      />
      {isActor && (
        <BottomListItem
          testID="comment_view_menu.edit"
          leftIcon="edit"
          title={t('post:comment_menu_edit')}
          onPress={_onPressEdit}
        />
      )}
      <BottomListItem
        testID="comment_view_menu.history"
        leftIcon="RotateRight"
        title={t('post:comment_menu_history')}
        onPress={_onPress}
      />
      {isActor && (
        <BottomListItem
          testID="comment_view_menu.delete"
          leftIcon="TrashCan"
          title={t('post:comment_menu_delete')}
          onPress={_onPressDelete}
        />
      )}
    </View>
  );
};

const createStyle = (
  theme: ExtendedTheme, insets: any,
) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    item: { height: 44 },
    reactContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    btnReact: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.violet1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reactionText: {
      fontSize: 24,
      lineHeight: 30,
    },
  });
};

export default CommentViewMenu;
