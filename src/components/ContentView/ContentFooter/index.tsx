import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Button, { ButtonProps } from '~/beinComponents/Button';
import { IReactionCounts } from '~/interfaces/IPost';
import { IconType } from '~/resources/icons';
import dimension from '~/theme/dimension';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import { formatLargeNumber } from '~/utils/formatData';
import modalActions from '~/storeRedux/modal/actions';
import { getTotalReactions, validateReactionCount } from '~/helpers/post';

export interface ContentFooterProps {
  btnReactTestID?: string;
  btnCommentTestID?: string;
  labelButtonComment: string;
  reactionsCount: IReactionCounts;
  canComment?:boolean;
  canReact?: boolean;
  hasReactPermission?: boolean;

  onAddReaction?: (key: string) => void;
  onPressComment?: (id?: string) => void;
}

const ContentFooter: FC<ContentFooterProps> = ({
  labelButtonComment,
  btnReactTestID,
  btnCommentTestID,
  reactionsCount,
  canComment,
  canReact,
  hasReactPermission = true,
  onAddReaction,
  onPressComment,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const validReactionCount = validateReactionCount(reactionsCount);
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
    dispatch(modalActions.setShowReactionBottomSheet(
      { visible: true, callback: onEmojiSelected },
    ));
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
          size: 20,
          tintColor: colors.neutral40,
        }}
        textProps={{
          variant: 'bodyM',
          color: colors.neutral80,
        }}
        style={styles.buttonReact}
      />
    </View>
  );

  const renderReactButtonItem = () => {
    if (!validReactionCount || !canReact) return null;

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
    <View style={[styles.emptyView, styles.disbaledReactComment]}>
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

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    reactButtons: {
      flexDirection: 'row',
      height: dimension.commentBarHeight,
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

export default ContentFooter;
