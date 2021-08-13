import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Reaction from '~/beinComponents/Badge/Reaction';
import reactions, {ReactionType} from '~/constants/reactions';
import {IOwnReaction, IReactionCounts} from '~/interfaces/IPost';
import commonActions, {IAction} from '~/constants/commonActions';

export interface ReactionViewProps {
  ownReactions: IOwnReaction;
  reactionCounts: IReactionCounts;
  onAddReaction: (reaction: ReactionType) => void;
  onRemoveReaction: (reaction: ReactionType) => void;
}

const ReactionView: FC<ReactionViewProps> = ({
  ownReactions,
  reactionCounts,
  onAddReaction,
  onRemoveReaction,
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

  const renderReactions = () => {
    const rendered: React.ReactNode[] = [];
    Object.keys(reactionCounts || {})?.map?.((key, index) => {
      const react = key as ReactionType;
      if (reactions?.[react] && reactionCounts?.[key]) {
        rendered.push(
          <Reaction
            key={`${index}_${key}`}
            style={{margin: 2}}
            value={reactionCounts[key]}
            icon={key}
            disableUpdateState
            selected={ownReactions?.[react]?.length > 0}
            onActionPress={action => onActionReaction(react, action)}
          />,
        );
      }
    });
    return rendered;
  };

  const renderedReactions = renderReactions();

  if (renderedReactions.length === 0) {
    return <View />;
  } else {
    return <View style={styles.container}>{renderReactions()}</View>;
  }
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing.padding.small,
    },
  });
};

export default ReactionView;
