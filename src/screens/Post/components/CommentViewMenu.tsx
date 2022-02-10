import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBaseHook} from '~/hooks';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {ReactionType} from '~/constants/reactions';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import * as modalActions from '~/store/modal/actions';
import Clipboard from '@react-native-clipboard/clipboard';
import {showHideToastMessage} from '~/store/modal/actions';
import Text from '~/beinComponents/Text';
import NodeEmoji from 'node-emoji';
import {quickReactions} from '~/configs/reactionConfig';

export interface CommentViewMenuProps {
  commentId: string;
  content: string;
  groupIds: string;
  isActor: boolean;
  onPressMoreReaction: (e: any) => void;
  onAddReaction: (reactionId: ReactionType) => void;
  onPressReply: () => void;
}

const CommentViewMenu: FC<CommentViewMenuProps> = ({
  commentId,
  content,
  groupIds,
  isActor,
  onPressMoreReaction,
  onAddReaction,
  onPressReply,
}: CommentViewMenuProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme, insets);

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
    rootNavigation.navigate(homeStack.createComment, {
      commentId: commentId,
      groupIds: groupIds,
    });
  };

  const _onPress = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const _onPressReply = () => {
    dispatch(modalActions.hideModal());
    onPressReply?.();
  };

  const _onPressCopy = () => {
    dispatch(modalActions.hideModal());
    if (content) {
      Clipboard.setString(content);
      dispatch(
        showHideToastMessage({
          content: 'common:text_copied_to_clipboard',
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
        }),
      );
    }
  };

  const renderReactItem = (item: any, index: number) => {
    return (
      <Button
        testID={`comment_view_menu.react_${index}`}
        key={`reaction_${index}_${item.id}`}
        onPress={() => _onPressReaction(item)}>
        <Text style={{fontSize: 24, lineHeight: 30}}>{item}</Text>
      </Button>
    );
  };

  const renderReact = () => {
    return (
      <View style={styles.reactContainer}>
        {quickReactions.map(renderReactItem)}
        <Button
          testID={'comment_view_menu.more_react'}
          style={styles.btnReact}
          onPress={_onPressMoreReaction}>
          <Icon icon={'iconReact'} size={22} />
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderReact()}
      <PrimaryItem
        testID={'comment_view_menu.reply'}
        style={styles.item}
        leftIcon={'CornerDownRight'}
        leftIconProps={{icon: 'CornerDownRight', size: 24}}
        title={t('post:comment_menu_reply')}
        onPress={_onPressReply}
      />
      <PrimaryItem
        testID={'comment_view_menu.copy'}
        style={styles.item}
        leftIcon={'Copy'}
        leftIconProps={{icon: 'Copy', size: 24}}
        title={t('post:comment_menu_copy_text')}
        onPress={_onPressCopy}
      />
      {isActor && (
        <PrimaryItem
          testID={'comment_view_menu.edit'}
          style={styles.item}
          leftIcon={'Edit'}
          leftIconProps={{icon: 'Edit', size: 24}}
          title={t('post:comment_menu_edit')}
          onPress={_onPressEdit}
        />
      )}
      <PrimaryItem
        testID={'comment_view_menu.history'}
        style={styles.item}
        leftIcon={'Redo'}
        leftIconProps={{icon: 'Redo', size: 24}}
        title={t('post:comment_menu_history')}
        onPress={_onPress}
      />
      {isActor && (
        <PrimaryItem
          testID={'comment_view_menu.delete'}
          style={styles.item}
          leftIcon={'Trash'}
          leftIconProps={{icon: 'Trash', size: 24}}
          title={t('post:comment_menu_delete')}
          onPress={_onPress}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    item: {height: 44},
    reactContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.base,
    },
    btnReact: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default CommentViewMenu;
