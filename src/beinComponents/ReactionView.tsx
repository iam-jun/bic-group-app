import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Reaction from '~/beinComponents/Badge/Reaction';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';

import {ITheme} from '~/theme/interfaces';
import {blacklistReactions, ReactionType} from '~/constants/reactions';
import {IOwnReaction, IReactionCounts} from '~/interfaces/IPost';
import commonActions, {IAction} from '~/constants/commonActions';
import appConfig from '~/configs/appConfig';

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
  const theme: ITheme = useTheme() as ITheme;
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
      ownerReactions.forEach(ownReaction => {
        if (ownReaction?.reactionName) {
          _ownReactions[ownReaction.reactionName] = ownReaction;
        }
      });
    }
    Object.values(reactionsCount || {})?.map((reaction: any) => {
      const key = Object.keys(reaction || {})?.[0];
      if (key) {
        reactionMap.set(key, reaction?.[key]);
      }
    });

    const rendered: React.ReactNode[] = [];
    for (const [key] of reactionMap) {
      const react = key as ReactionType;
      if (!blacklistReactions?.[react] && reactionMap.get(key) > 0) {
        rendered.push(
          <Reaction
            testId={`reaction.button.${key}`}
            key={`${key}`}
            style={{margin: 2}}
            value={reactionMap.get(key)}
            icon={key}
            disableUpdateState
            onLongPress={() => _onLongPressItem(react)}
            loading={_ownReactions?.[react]?.loading}
            selected={!!_ownReactions?.[react]?.id}
            onActionPress={action => onActionReaction(react, action)}
          />,
        );
      }
    }
    return rendered;
  };

  const renderedReactions = renderReactions();

  if (renderedReactions.length === 0) {
    return (
      <View style={styles.containerButtonOnly}>
        {!!onPressSelectReaction && showSelectReactionWhenEmpty && (
          <Button
            style={styles.buttonReact}
            onPress={onPressSelectReaction}
            testID="reaction_view.react">
            <Icon size={16} icon={'iconReact'} />
          </Button>
        )}
      </View>
    );
  } else {
    return (
      <View style={[styles.container, style]} testID="reaction_view">
        {renderReactions()}
        {!!onPressSelectReaction &&
          renderedReactions.length < appConfig.limitReactionCount && (
            <Button
              style={[styles.buttonReact, styles.marginHorizontal6]}
              onPress={onPressSelectReaction}>
              <Icon size={16} icon={'iconReact'} testID="reaction_view.react" />
            </Button>
          )}
      </View>
    );
  }
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
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
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.small,
    },
    buttonReact: {
      marginVertical: 2,
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: spacing?.borderRadius.small,
      paddingHorizontal: spacing.padding.tiny,
      paddingVertical: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    marginHorizontal6: {marginHorizontal: 6},
  });
};

export default ReactionView;
