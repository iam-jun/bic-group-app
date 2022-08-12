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
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';

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
  const { t } = useBaseHook();

  const validReactionCount = validateReactionCount(reactionCounts);
  const numberOfReactions = Object.keys(reactionCounts).length;
  const labelReactionCount = `${
    numberOfReactions ? `${numberOfReactions} ` : ''
  }${t('post:button_react')}`;

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
          size: 20,
          tintColor: colors.neutral40,
        }}
        textProps={{
          variant: 'bodyM',
          color: colors.neutral80,
        }}
        style={styles.buttonReact}
      >
        {title}
      </Button>
    </View>
  );

  return (
    <View style={[styles.reactButtons, !canComment && !canReact && styles.disbaledReactComment]}>
      {(validReactionCount && !!canReact) && (
        <>
          {renderReactButtonItem(
            labelReactionCount,
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
      <View style={[styles.emptyView, styles.disbaledReactComment]}>
        <Text.BodyS color={theme.colors.neutral20} useI18n>post:text_cannot_comment_and_react</Text.BodyS>
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
    disbaledReactComment: {
      height: 36,
      marginTop: spacing.margin.tiny,
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
      backgroundColor: colors.neutral2,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default PostViewFooter;
