import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '~/beinComponents/Icon';
import reactionConfig from '~/components/reaction/reactionConfig';
import Button from '~/beinComponents/Button';
import { IReactionProps } from '~/interfaces/IReaction';
import spacing from '~/theme/spacing';

export interface ReactionViewProps {
  onPressReaction: (reaction: IReactionProps) => void;
}

const SelectReactionView: FC<ReactionViewProps> = ({
  onPressReaction,
}: ReactionViewProps) => {
  const _onPressReaction = (item: IReactionProps) => {
    onPressReaction?.(item);
  };

  const renderRow = (
    row: IReactionProps[], rowIndex: any,
  ) => (
    <View key={`reaction_row_${rowIndex}`} style={styles.row}>
      {row.map((
        item, index,
      ) => (
        <Button
          key={`reaction_${rowIndex}_${index}_${item.id}`}
          onPress={() => _onPressReaction(item)}
        >
          <Icon icon={item.icon} size={30} />
        </Button>
      ))}
    </View>
  );

  return <View style={styles.container}>{reactionConfig.map(renderRow)}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.large,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.margin.tiny,
  },
});

export default SelectReactionView;
