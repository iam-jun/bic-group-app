import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Reaction from '~/baseComponents/Reaction';
import Button from '~/beinComponents/Button';

import { ReactionType } from '~/constants/reactions';
import { IOwnReaction, IReactionCounts, MapReactionsCountCallback } from '~/interfaces/IPost';
import commonActions, { IAction } from '~/constants/commonActions';
import appConfig from '~/configs/appConfig';
import spacing from '~/theme/spacing';
import Icon from '../baseComponents/Icon';
import useEmojiPickerStore from '~/baseComponents/EmojiPicker/store';
import { mapReactionsCount } from '~/helpers/post';

export interface ReactionViewProps {
  style?: StyleProp<ViewStyle>;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
  hasReactPermission?: boolean;
  showSelectReactionWhenEmpty?: boolean;
  onAddReaction: (reaction: ReactionType) => void;
  onRemoveReaction: (reaction: ReactionType) => void;
  onPressSelectReaction?: (event: any) => void;
  onLongPressReaction?: (reactionType: ReactionType) => void;
}

const ReactionView: FC<ReactionViewProps> = ({
  style,
  ownerReactions,
  reactionsCount,
  onAddReaction,
  onRemoveReaction,
  onPressSelectReaction,
  onLongPressReaction,
  showSelectReactionWhenEmpty = true,
  hasReactPermission = true,
}: ReactionViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const actions = useEmojiPickerStore((state) => state.actions);

  const onActionReaction = (reactionId: ReactionType, action: IAction) => {
    if (action === commonActions.selectEmoji) {
      onAddReaction?.(reactionId);
      actions.addToRecently(reactionId);
    } else {
      onRemoveReaction?.(reactionId);
    }
  };

  const _onLongPressItem = (reactionType: ReactionType) => {
    onLongPressReaction?.(reactionType);
  };

  /**
   * reaction use in logic is camelCase, but for display, it should be snake_case
   * we have to convert ownReaction.reactionName and reactionsCount key
   */
  const renderReactions = () => {
    const _ownReactions: any = {};

    if (ownerReactions?.length > 0) {
      ownerReactions.forEach((ownReaction) => {
        if (ownReaction?.reactionName) {
          _ownReactions[ownReaction.reactionName] = ownReaction;
        }
      });
    }

    const rendered: React.ReactNode[] = [];

    const mapReactionsCountCallback: MapReactionsCountCallback = (reactionName, value) => {
      rendered.push(
        <Reaction
          testId={`reaction.button.${reactionName}`}
          key={`${reactionName}`}
          style={styles.reactionItem}
          value={value}
          icon={reactionName}
          onLongPress={() => _onLongPressItem(reactionName)}
          loading={!!_ownReactions?.[reactionName]?.loading}
          selected={!!_ownReactions?.[reactionName]}
          onActionPress={(action) => onActionReaction(reactionName, action)}
          disabled={!hasReactPermission}
        />,
      );
    };

    mapReactionsCount(reactionsCount, mapReactionsCountCallback);

    return rendered;
  };

  const renderedReactions = renderReactions();

  return (
    <View testID="reaction_view_container">
      {!hasReactPermission && renderedReactions.length > 0 && <View style={styles.line} />}
      <View
        style={[
          styles.container,
          renderedReactions.length > 0 ? styles.withPadding : null,
          style,
        ]}
        testID="reaction_view"
      >
        {renderedReactions}
        {!!onPressSelectReaction
          && showSelectReactionWhenEmpty
          && renderedReactions.length < appConfig.limitReactionCount && (
            <Button
              style={styles.buttonReact}
              onPress={onPressSelectReaction}
              testID="reaction_view.react"
            >
              <Icon size={16} icon="iconReact" />
            </Button>
        )}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    containerButtonOnly: {
      flex: 1,
      alignItems: 'flex-start',
      paddingTop: spacing.padding.small,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    withPadding: {
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.small,
    },
    line: {
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.xSmall,
    },
    buttonReact: {
      marginVertical: 2,
      borderWidth: 1,
      borderColor: colors.gray20,
      borderRadius: spacing?.borderRadius.small,
      paddingHorizontal: spacing.padding.tiny,
      paddingVertical: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    marginHorizontal6: { marginHorizontal: 6 },
    reactionItem: {
      marginBottom: spacing.margin.tiny,
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default ReactionView;
