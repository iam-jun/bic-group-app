import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Reaction from '~/beinComponents/Badge/Reaction';
import reactions, {ReactionType} from '~/constants/reactions';
import {IOwnReaction, IReactionCounts} from '~/interfaces/IPost';
import commonActions, {IAction} from '~/constants/commonActions';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';

export interface ReactionViewProps {
  ownReactions: IOwnReaction;
  reactionCounts: IReactionCounts;
  onAddReaction: (reaction: ReactionType) => void;
  onRemoveReaction: (reaction: ReactionType) => void;
  onPressSelectReaction?: (event: any) => void;
}

const ReactionView: FC<ReactionViewProps> = ({
  ownReactions,
  reactionCounts,
  onAddReaction,
  onRemoveReaction,
  onPressSelectReaction,
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
            loading={ownReactions?.[react]?.[0]?.loading}
            selected={!!ownReactions?.[react]?.[0]?.id}
            onActionPress={action => onActionReaction(react, action)}
          />,
        );
      }
    });
    return rendered;
  };

  const renderedReactions = renderReactions();

  if (renderedReactions.length === 0) {
    return (
      <View style={styles.containerButtonOnly}>
        {!!onPressSelectReaction && (
          <Button style={styles.buttonReact} onPress={onPressSelectReaction}>
            <Icon size={16} icon={'iconReact'} />
          </Button>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {renderReactions()}
        {!!onPressSelectReaction && (
          <Button
            style={[styles.buttonReact, styles.marginHorizontal6]}
            onPress={onPressSelectReaction}>
            <Icon size={16} icon={'iconReact'} />
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
      marginTop: spacing.margin.small,
      marginLeft: spacing.margin.small,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing.padding.small,
    },
    buttonReact: {
      marginVertical: 2,
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: spacing?.borderRadius.small,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    marginHorizontal6: {marginHorizontal: 6},
  });
};

export default ReactionView;
