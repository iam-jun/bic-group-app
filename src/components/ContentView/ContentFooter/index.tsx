import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Button, { ButtonProps } from '~/beinComponents/Button';
import { IReactionCounts } from '~/interfaces/IPost';
import { IconType } from '~/resources/icons';
import dimension from '~/theme/dimension';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import { formatLargeNumber } from '~/utils/formatter';
import { getTotalReactions, isReactableNewReaction } from '~/helpers/post';
import useModalStore from '~/store/modal';

export interface ContentFooterProps {
  btnReactTestID?: string;
  btnCommentTestID?: string;
  labelButtonComment: string;
  reactionsCount: IReactionCounts;
  canComment?:boolean;
  canReact?: boolean;
  hasReactPermission?: boolean;

  onAddReaction?: (key: string) => void;
  onPressReaction?: () => void;
  onPressComment?: (id?: string) => void;
}

const ContentFooter: FC<ContentFooterProps> = ({
  labelButtonComment,
  btnReactTestID = 'content_footer.btn_react',
  btnCommentTestID = 'content_footer.btn_comment',
  reactionsCount,
  canComment,
  canReact,
  hasReactPermission = true,
  onAddReaction,
  onPressComment,
  onPressReaction,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();
  const { t } = useBaseHook();
  const modalActions = useModalStore((state) => state.actions);

  const canReactNewReaction = isReactableNewReaction(reactionsCount);
  const numberOfReactions = formatLargeNumber(getTotalReactions(reactionsCount, 'user'));
  const labelReactionCount = `${
    numberOfReactions ? `${numberOfReactions} ` : ''
  }${t('post:button_react')}`;

  const onEmojiSelected = (key: string) => {
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = () => {
    if (onPressReaction) return onPressReaction();

    modalActions.setShowReactionBottomSheet(
      { visible: true, callback: onEmojiSelected },
    );
  };

  const renderButtonItem = (
    buttonProps: ButtonProps,
    icon: IconType,
  ) => (
    <View style={styles.buttonReactContainer}>
      <Button
        {...buttonProps}
        leftIcon={icon}
        leftIconProps={{
          icon,
          size: 18,
          tintColor: colors.neutral40,
        }}
        textProps={{
          testID: `${buttonProps.testID}.text`,
          variant: 'bodyM',
          color: colors.neutral60,
        }}
        style={styles.buttonReact}
      />
    </View>
  );

  const renderReactButtonItem = () => {
    if (!canReactNewReaction || !canReact) return null;

    return (
      <>
        {renderButtonItem({
          testID: btnReactTestID,
          children: labelReactionCount,
          onPress: onPressReact,
          onLongPress: onPressReact,
        },
        'iconReact')}
      </>
    );
  };

  const renderCommentButtonItem = () => {
    if (!canComment) return null;

    return renderButtonItem({
      testID: btnCommentTestID,
      children: labelButtonComment,
      disabled: !onPressComment,
      onPress: onPressComment,
      onLongPress: onPressComment,
    },
    'MessageDots');
  };

  const renderCannotReactView = () => (
    <View
      testID="content_footer.cannot_reaction_view"
      style={[styles.emptyView, styles.disbaledReactComment]}
    >
      <Text.BodyS color={theme.colors.neutral20} useI18n>
        post:text_cannot_comment_and_react
      </Text.BodyS>
    </View>
  );

  if (!hasReactPermission || (!canComment && !canReact)) {
    return renderCannotReactView();
  }

  return (
    <View style={[styles.reactButtons, !canComment && !canReact && styles.disbaledReactComment]}>
      {renderReactButtonItem()}
      {renderCommentButtonItem()}
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  reactButtons: {
    flexDirection: 'row',
    height: dimension.commentBarHeight,
    alignItems: 'center',
    paddingHorizontal: spacing.padding.large,
    marginBottom: spacing.margin.small,
  },
  disbaledReactComment: {
    height: 28,
    marginBottom: spacing.margin.small,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContentFooter;
