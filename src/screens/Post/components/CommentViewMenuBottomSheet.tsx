import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBaseHook} from '~/hooks';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import {IReactionProps} from '~/interfaces/IReaction';
import {reactionDefault} from '~/beinFragments/reaction/reactionConfig';
import {ReactionType} from '~/constants/reactions';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

export interface CommentViewMenuBottomSheetProps {
  modalizeRef: any;
  commentId: string;
  groupIds: string;
  isActor: boolean;
  onPressMoreReaction: () => void;
  onAddReaction: (reactionId: ReactionType) => void;
  onPressReply: () => void;
}

const CommentViewMenuBottomSheet: FC<CommentViewMenuBottomSheetProps> = ({
  modalizeRef,
  commentId,
  groupIds,
  isActor,
  onPressMoreReaction,
  onAddReaction,
  onPressReply,
}: CommentViewMenuBottomSheetProps) => {
  const {rootNavigation} = useRootNavigation();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme, insets);

  const _onPressReaction = (item: IReactionProps) => {
    modalizeRef?.current?.close?.();
    onAddReaction?.(item.id);
  };

  const _onPressMoreReaction = () => {
    modalizeRef?.current?.close?.();
    onPressMoreReaction?.();
  };

  const _onPressEdit = () => {
    modalizeRef?.current?.close?.();
    rootNavigation.navigate(homeStack.createComment, {
      commentId: commentId,
      groupIds: groupIds,
    });
  };

  const _onPressReply = () => {
    modalizeRef?.current?.close?.();
    onPressReply?.();
  };

  const renderReactItem = (item: any, index: number) => {
    return (
      <Button
        key={`reaction_${index}_${item.id}`}
        onPress={() => _onPressReaction(item)}>
        <Icon icon={item.icon} size={32} />
      </Button>
    );
  };

  const renderReact = () => {
    return (
      <View style={styles.reactContainer}>
        {reactionDefault.map(renderReactItem)}
        <Button style={styles.btnReact} onPress={_onPressMoreReaction}>
          <Icon icon={'iconReact'} size={22} />
        </Button>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.container}>
        {renderReact()}
        <PrimaryItem
          style={styles.item}
          leftIcon={'CornerDownRight'}
          leftIconProps={{icon: 'CornerDownRight', size: 24}}
          title={'Reply this comment'}
          onPress={_onPressReply}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Copy'}
          leftIconProps={{icon: 'Copy', size: 24}}
          title={'Copy text'}
        />
        {isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'Edit'}
            leftIconProps={{icon: 'Edit', size: 24}}
            title={'Edit Comment'}
            onPress={_onPressEdit}
          />
        )}
        <PrimaryItem
          style={styles.item}
          leftIcon={'Redo'}
          leftIconProps={{icon: 'Redo', size: 24}}
          title={'View Edit History'}
        />
        {isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'Trash'}
            leftIconProps={{icon: 'Trash', size: 24}}
            title={'Delete Comment'}
          />
        )}
      </View>
    );
  };

  return (
    <BottomSheet modalizeRef={modalizeRef} ContentComponent={renderContent()} />
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

export default CommentViewMenuBottomSheet;
