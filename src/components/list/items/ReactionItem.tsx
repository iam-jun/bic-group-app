import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import Text from '../../texts/Text';
import Icon, {IconProps} from '../../../beinComponents/Icon';
import {white as WHITE_COLOR} from '~/theme/colors';

export interface Props {
  style?: StyleProp<ViewStyle>;
  icon: IconProps;
  value: string;
  tintColor?: string;
}

const ReactionItem: React.FC<Props> = ({
  style,
  icon,
  value,
  tintColor = WHITE_COLOR,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon {...icon} tintColor={tintColor} size={9} style={styles.icon} />
      <Text>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginEnd: 6,
    padding: 4,
    borderRadius: 100,
  },
});

export default ReactionItem;
