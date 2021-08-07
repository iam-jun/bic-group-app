import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Reaction from '~/beinComponents/Badge/Reaction';
import reactions, {ReactionType} from '~/constants/reactions';

export interface ReactionViewProps {
  ownReactions: any;
  reactionCounts: any;
}

const ReactionView: FC<ReactionViewProps> = ({
  ownReactions,
  reactionCounts,
}: ReactionViewProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  if (Object.keys?.(reactionCounts)?.length === 0) {
    return null;
  }

  const renderReactions = () => {
    const rendered: React.ReactNode[] = [];
    Object.keys(reactionCounts || {}).map((key, index) => {
      const react = key as ReactionType;
      if (reactions?.[react] && reactionCounts?.[key]) {
        rendered.push(
          <Reaction
            key={`${index}_${key}`}
            style={{margin: 2}}
            value={reactionCounts[key]}
            icon={key}
            selected={false}
            onActionPress={() =>
              console.log('\x1b[36m', '🐣️ onPress |  : ', '\x1b[0m')
            }
          />,
        );
      }
    });
    return rendered;
  };

  return <View style={styles.container}>{renderReactions()}</View>;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing.padding.small,
    },
  });
};

export default ReactionView;
