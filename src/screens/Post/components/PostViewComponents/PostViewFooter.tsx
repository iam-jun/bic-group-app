import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import { IReactionCounts } from '~/interfaces/IPost';
import { IconType } from '~/resources/icons';
import * as modalActions from '~/store/modal/actions';
import { validateReactionCount } from './helper';
import dimension from '~/theme/dimension';
import Text from '~/beinComponents/Text';

export interface PostViewFooterProps {
  labelButtonComment: string;
  onAddReaction?: any;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  onPressComment?: () => void;
  reactionCounts: IReactionCounts;
  canComment?:boolean;
  canReact?: boolean;
}

const PostViewFooter: FC<PostViewFooterProps> = ({
  labelButtonComment,
  onAddReaction,
  btnReactTestID,
  btnCommentTestID,
  onPressComment,
  reactionCounts,
  canComment,
  canReact,
}: PostViewFooterProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const validReactionCount = validateReactionCount(reactionCounts);

  const onEmojiSelected = (
    emoji: string, key?: string,
  ) => {
    dispatch(modalActions.hideModal());
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = () => {
    const payload = {
      isOpen: true,
      ContentComponent: (
        <EmojiBoard
          width={dimension.deviceWidth}
          height={280}
          onEmojiSelected={onEmojiSelected}
        />
      ),
    };
    dispatch(modalActions.showModal(payload));
  };

  const renderReactButtonItem = (
    title: string,
    icon: IconType,
    onPress: any,
    onLongPress: any,
    disabled?: boolean,
    testID?: string,
  ) => (
    <View style={styles.buttonReactContainer}>
      <Button
        testID={testID}
        useI18n
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        leftIcon={icon}
        leftIconProps={{
          icon,
          size: 18,
          tintColor: colors.neutral40,
        }}
        textProps={{
          variant: 'numberS',
          color: colors.neutral80,
        }}
        style={styles.buttonReact}
      >
        {title}
      </Button>
    </View>
  );

  return (
    <View style={styles.reactButtons}>
      {(validReactionCount && !!canReact) && (
        <>
          {renderReactButtonItem(
            'post:button_react',
            'iconReact',
            onPressReact,
            onPressReact,
            false,
            btnReactTestID,
          )}
        </>
      )}
      {!!canComment
       && renderReactButtonItem(
         labelButtonComment,
         'MessageDots',
         onPressComment,
         onPressComment,
         !onPressComment,
         btnCommentTestID,
       )}
      {!canComment && !canReact && (
      <View style={styles.emptyView}>
        <Text.BodyS color={theme.colors.gray70} useI18n>post:text_cannot_comment_and_react</Text.BodyS>
      </View>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    reactButtons: {
      flexDirection: 'row',
      height: dimension?.commentBarHeight,
      alignItems: 'center',
    },
    buttonReactContainer: {
      flex: 1,
      height: 'auto',
    },
    buttonReact: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyView: {
      backgroundColor: colors.gray1,
      flex: 1,
      height: dimension?.commentBarHeight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default PostViewFooter;
