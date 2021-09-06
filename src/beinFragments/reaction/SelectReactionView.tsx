import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import reactionConfig from '~/beinFragments/reaction/reactionConfig';
import Button from '~/beinComponents/Button';
import {IReactionProps} from '~/interfaces/IReaction';

export interface ReactionViewProps {
  onPressReaction: (reaction: IReactionProps) => void;
}

const SelectReactionView: FC<ReactionViewProps> = ({
  onPressReaction,
}: ReactionViewProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const _onPressReaction = (item: IReactionProps) => {
    onPressReaction?.(item);
  };

  const renderRow = (row: IReactionProps[], rowIndex: any) => {
    return (
      <View key={`reaction_row_${rowIndex}`} style={styles.row}>
        {row.map((item, index) => (
          <Button
            key={`reaction_${rowIndex}_${index}_${item.id}`}
            onPress={() => _onPressReaction(item)}>
            <Icon icon={item.icon} size={30} />
          </Button>
        ))}
      </View>
    );
  };

  return <View style={styles.container}>{reactionConfig.map(renderRow)}</View>;
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
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
};

export default SelectReactionView;
