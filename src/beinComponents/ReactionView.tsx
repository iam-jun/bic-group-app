import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Reaction from '~/baseComponents/Reaction';
import Button from '~/beinComponents/Button';

import { blacklistReactions, ReactionType } from '~/constants/reactions';
import { IOwnReaction, IReactionCounts } from '~/interfaces/IPost';
import commonActions, { IAction } from '~/constants/commonActions';
import appConfig from '~/configs/appConfig';
import spacing from '~/theme/spacing';
import Icon from './Icon';

export interface ReactionViewProps {
  style?: StyleProp<ViewStyle>;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
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
}: ReactionViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const onActionReaction = (reactionId: ReactionType, action: IAction) => {
    if (action === commonActions.selectEmoji) {
      onAddReaction?.(reactionId);
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
    const reactionMap = new Map();

    if (ownerReactions?.length > 0) {
      ownerReactions.forEach((ownReaction) => {
        if (ownReaction?.reactionName) {
          _ownReactions[ownReaction.reactionName] = ownReaction;
        }
      });
    }
    Object.values(reactionsCount || {})?.forEach((reaction: any) => {
      const key = Object.keys(reaction || {})?.[0];
      if (key) {
        reactionMap.set(key, reaction?.[key]);
      }
    });

    const rendered: React.ReactNode[] = [];

    reactionMap.forEach((value, key) => {
      const react = key as ReactionType;
      if (!blacklistReactions?.[react] && reactionMap.get(key) > 0) {
        rendered.push(
          <Reaction
            testId={`reaction.button.${key}`}
            key={`${key}`}
            style={styles.reactionItem}
            value={reactionMap.get(key)}
            icon={key}
            disableUpdateState
            onLongPress={() => _onLongPressItem(react)}
            loading={_ownReactions?.[react]?.loading}
            selected={!!_ownReactions?.[react]?.id}
            onActionPress={(action) => onActionReaction(react, action)}
          />,
        );
      }
    });

    return rendered;
  };

  const renderedReactions = renderReactions();

  // if (renderedReactions.length === 0) {
  //   return (
  //     <View style={styles.containerButtonOnly}>
  //       {!!onPressSelectReaction && showSelectReactionWhenEmpty && (
  //         <Button
  //           style={styles.buttonReact}
  //           onPress={onPressSelectReaction}
  //           testID="reaction_view.react"
  //         >
  //           <Icon size={16} icon="iconReact" />
  //         </Button>
  //       )}
  //     </View>
  //   );
  // }
  return (

    <View
      style={[
        styles.container,
        renderedReactions.length > 0 ? styles.withPadding : null,
        style,
      ]}
      testID="reaction_view"
    >
      {renderReactions()}
      {!!onPressSelectReaction && showSelectReactionWhenEmpty
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
