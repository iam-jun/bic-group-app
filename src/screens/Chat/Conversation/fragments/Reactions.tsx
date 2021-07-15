import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {IReaction} from '~/interfaces/IChat';
import Icon from '~/components/Icon';
import {spacing} from '~/theme';
import {default as reactionsIcons} from '~/constants/reactions';
import {generateUniqueId} from '~/utils/generator';

export interface Props {
  data: IReaction[];
  onPress: Function;
  [x: string]: any;
}

const Reactions: React.FC<Props> = ({data, onPress}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {data
        .filter(item => item.count > 0)
        .map((item: IReaction) => {
          return (
            <Icon
              key={`reaction-${generateUniqueId()}-${item?.type}`}
              onPress={() => onPress(item)}
              isButton
              icon={reactionsIcons[item.type].icon}
              label={`${item.count}`}
              style={styles.icon}
            />
          );
        })}
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    icon: {
      marginEnd: spacing.margin.small,
    },
  });
};

export default Reactions;
